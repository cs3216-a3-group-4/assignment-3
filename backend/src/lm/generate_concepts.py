from pydantic import BaseModel
from sqlalchemy import exists, select
from src.events.models import ArticleConcept, Concept, Article

from sqlalchemy.orm import Session
from src.common.database import engine

import json

from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.output_parsers import JsonOutputParser

from src.lm.lm import CONCURRENCY, lm_model_concept as lm_model
from src.lm.concept_gen_prompt import CONCEPT_GEN_SYSPROMPT as SYSPROMPT

import asyncio

CONCEPTS_FILE_PATH = "concepts_output.json"


class ArticleConceptLM(BaseModel):
    concept: str
    explanation: str


class ArticleConcepts(BaseModel):
    summary: str
    concepts: list[ArticleConceptLM]


class ArticleConceptsWithId(ArticleConcepts):
    article_id: int


async def generate_concept_from_article(
    article: Article, res: list[ArticleConceptsWithId], semaphore: asyncio.Semaphore
):
    async with semaphore:
        while True:
            try:
                title: str = article.title  # noqa: F841
                content: str = article.body  # noqa: F841

                human_message: str = f"""
                Article Title: {title}
                Article Description: {content}
                """

                # TODO(marcus): fill this in
                messages = [
                    SystemMessage(content=SYSPROMPT),
                    HumanMessage(content=human_message),
                ]

                result = await lm_model.ainvoke(messages)
                parser = JsonOutputParser(pydantic_object=ArticleConcepts)
                concepts = parser.invoke(result)
                print(f"Model temp: {lm_model.temperature}")
                break
            except Exception as e:  # noqa: E722
                print(e)
                print("hit the rate limit! waiting 10s for article", article.id)
                await asyncio.sleep(10)

    res.append(
        ArticleConceptsWithId(
            concepts=concepts["concepts"],
            summary=concepts["summary"],
            article_id=article.id,
        )
    )


async def generate_concepts(limit: int | None = None, add_to_db: bool = True):
    with Session(engine) as session:
        # query db for article
        subquery = select(ArticleConcept.article_id)
        query = (
            select(Article).where(
                ~exists(subquery.where(ArticleConcept.article_id == Article.id))
            )
            # NOTE: @seeleng: Help to check if this is correct. I think this won't be needed anymore
            # .options(selectinload(Analysis.event).selectinload(Event.original_article))
        )
        if limit:
            query = query.limit(limit)
        articles = session.scalars(query).all()

        # call blackbox lm function
        res: list[ArticleConceptsWithId] = []
        semaphore = asyncio.Semaphore(CONCURRENCY)
        async with asyncio.TaskGroup() as tg:
            for article in articles:
                tg.create_task(generate_concept_from_article(article, res, semaphore))

        if add_to_db:
            # first, lowercase all concepts in result
            concepts: list[str] = []
            for article_concept_with_id in res:
                for concept in article_concept_with_id.concepts:
                    concept.concept = concept.concept.lower()
                    concepts.append(concept.concept)

            # query concepts that match
            existing_concepts = session.scalars(
                select(Concept).where(Concept.name.in_(concepts))
            ).all()

            concept_map = {
                existing_concept.name: existing_concept
                for existing_concept in existing_concepts
            }

            # add concept to db if not exist
            existing_concept_names = [concept.name for concept in existing_concepts]

            missing_concepts_string = set()
            for article_concept_with_id in res:
                for concept in article_concept_with_id.concepts:
                    concept_name = concept.concept
                    if concept_name not in existing_concept_names:
                        missing_concepts_string.add(concept_name)

            missing_concepts = [
                Concept(name=concept) for concept in missing_concepts_string
            ]
            session.add_all(missing_concepts)
            session.commit()

            for concept in missing_concepts:
                session.refresh(concept)
                concept_map[concept.name] = concept

            # add new models to db
            results = []
            for article_concept_with_id in res:
                for article_concept_llm in article_concept_with_id.concepts:
                    results.append(
                        ArticleConcept(
                            article_id=article_concept_with_id.article_id,
                            explanation=article_concept_llm.explanation,
                            concept_id=concept_map[article_concept_llm.concept].id,
                        )
                    )

            session.add_all(results)
            session.commit()

        # return json in case you need it for something
        with open(CONCEPTS_FILE_PATH, "w") as json_file:
            json.dump([dto.model_dump() for dto in res], json_file, indent=4)
        return res


if __name__ == "__main__":
    # TODO(marcus): probably remove/change this
    asyncio.run(generate_concepts(5))
