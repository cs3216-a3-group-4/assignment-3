from pydantic import BaseModel
from sqlalchemy import exists, select
from src.events.models import ArticleConcept, Concept, Article

from sqlalchemy.orm import Session
from src.common.database import engine

import json

from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
from openai import RateLimitError

from src.lm.lm import CONCURRENCY, lm_model_concept as lm_model
from src.lm.concept_gen_prompt import CONCEPT_GEN_SYSPROMPT as SYSPROMPT
from pydantic import ValidationError

import asyncio

CONCEPTS_FILE_PATH = "src/scripts/concepts_output.json"


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

                messages = [
                    SystemMessage(content=SYSPROMPT),
                    HumanMessage(content=human_message),
                ]

                result = await lm_model.ainvoke(messages)
                parser = JsonOutputParser(pydantic_object=ArticleConcepts)
                concepts = parser.invoke(result)

                # NOTE: concepts might be None if the LM hallucinates in a certain way
                if concepts is None:
                    print(
                        "Parser invoke returned None, skipping article ",
                        article.id,
                    )
                    return

                res.append(
                    ArticleConceptsWithId(
                        concepts=concepts.get("concepts", []),
                        summary=concepts.get("summary", ""),
                        article_id=article.id,
                    )
                )
                break
            except OutputParserException as e:
                print(e)
                print("LM generated a bad response, skipping article ", article.id)
                break
            except ValidationError as e:
                print(e)
                print("Validation error with article ", article.id)
            except RateLimitError as e:
                print(e)
                print("Hit the rate limit! waiting 10s for article", article.id)
                await asyncio.sleep(10)
            except Exception as e:  # noqa: E722
                print(e)
                print("Something went wrong with article ", article.id)
                break


def add_concepts_to_db(article_concepts: list[ArticleConceptsWithId]):
    with Session(engine) as session:
        # first, lowercase all concepts in result
        concepts: list[str] = []
        for article_concept_with_id in article_concepts:
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
        for article_concept_with_id in article_concepts:
            article_id = article_concept_with_id.article_id

            cur_article: Article = session.scalars(
                select(Article).where(Article.id == article_id)
            ).first()
            if not cur_article:
                print(f"Article with id {article_id} does not exist in db")
            else:
                print(f"Updating concepts for article {article_id}")
                cur_article.summary = article_concept_with_id.summary

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
        for article_concept_with_id in article_concepts:
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


async def generate_concepts(limit: int | None = None, add_to_db: bool = True):
    with Session(engine) as session:
        # query db for article
        subquery = select(ArticleConcept.article_id)
        query = select(Article).where(
            ~exists(subquery.where(ArticleConcept.article_id == Article.id))
        )
        if limit is not None:
            query = query.limit(limit)
        articles = session.scalars(query).all()

        # call blackbox lm function
        res: list[ArticleConceptsWithId] = []
        semaphore = asyncio.Semaphore(CONCURRENCY)
        async with asyncio.TaskGroup() as tg:
            for article in articles:
                tg.create_task(generate_concept_from_article(article, res, semaphore))

        if add_to_db:
            add_concepts_to_db(res)

        # return json in case you need it for something
        with open(CONCEPTS_FILE_PATH, "w") as json_file:
            json.dump([dto.model_dump() for dto in res], json_file, indent=4)
        return res


if __name__ == "__main__":
    pass
    # TODO(marcus): probably remove/change this
    # pass
    asyncio.run(generate_concepts(4000))

    # res_2 = """{
    #     "summary": "Thailand's Constitutional Court is set to deliver a verdict on August 7 regarding the potential dissolution of the opposition party Move Forward, following a petition from the election commission. The case centers around the party's past campaign to amend the royal insult law, a deeply sensitive issue tied to the monarchy's protection in Thailand. Move Forward, which gained significant urban and youth support during last year's elections, has denied any wrongdoing and asserts that their intentions were to strengthen the constitutional monarchy. The impending decision comes amid other political controversies, adding to the uncertainties within Thailand's political landscape.",
    #     "concepts": [
    #         {
    #             "concept": "Political Legitimacy and Governance",
    #             "explanation": "The interplay between political legitimacy and governance becomes evident in the context of Thailand's opposition parties and the legal structures that regulate them. In a system where the monarchy holds significant sway, political entities like Move Forward emerge as challengers to traditional norms, seeking to redefine the boundaries of acceptable governance. The attempt to amend the royal insult law reflects a broader trend where citizens engage in civic discourse against established authorities, raising significant questions about the nature and limits of political engagement within a monarchy. This situation illustrates how political movements can be both a reaction to and a catalyst for systemic governance changes, leading to shifts in public perception and engagement with governmental structures.",
    #         },
    #         {
    #             "concept": "Youth Activism and Political Change",
    #             "explanation": "The rise of youth-led movements signals a transformative shift in political dynamics, particularly in regions with entrenched political structures. In Thailand, the emergence of Move Forward, supported predominantly by urban youth, epitomizes a broader global trend where younger generations challenge established political norms and advocate for reform. This phenomenon often manifests in demanding more transparency, accountability, and responsiveness from governments. The relationship between youth activism and political change is critical, as it shapes not only the immediate political landscape but also the long-term implications for governance and civil society. The ongoing uncertainties within Thailand's political arena illustrate the potential for youth movements to disrupt traditional power balances and promote progressive ideologies.",
    #         },
    #         {
    #             "concept": "Judicial Independence and Political Influence",
    #             "explanation": "The role of the judiciary in mediating political disputes often reveals the extent of political influence within a legal framework. The ongoing legal challenges faced by Move Forward underscore the complex relationship between judicial independence and political power. In scenarios where courts become arbiters in politically charged cases, the judicial system's integrity is tested, raising concerns about the impartiality of legal proceedings. Moreover, the tension between the ruling elite and opposition parties can lead to judicial actions that appear to favor one side, impacting public trust in the legal system. The anticipation surrounding the court's verdict reflects broader societal anxieties about the balancing act between maintaining legal order and protecting democratic principles against political maneuvering.",
    #         },
    #     ],
    # }"""
    # print(json.dumps(res_2))
    # parser = JsonOutputParser(pydantic_object=ArticleConcepts)
    # result = parser.invoke(json.dumps(json.loads(res_2)))

    # print("done w/ ", result)

    # # obj = ArticleConceptsWithId(
    # #     concepts=123,
    # #     summary="",
    # #     article_id=1,
    # # )
    # # print(obj)
