import asyncio
import json
from sqlalchemy import select
from src.events.models import Article
from src.lm.dict_types import (
    AllPointsWithConceptsType,
    PointWithConceptsAndLLMType,
    PointWithConceptsType,
    PointsWithConceptsAfterLLMType,
)
from src.lm.society_classifier import classify_society_qn
from src.lm.generate_points import generate_points_from_question
from src.embeddings.store_concepts import ArticleConceptLLMType, get_similar_concepts

from src.common.database import engine
from sqlalchemy.orm import Session

from src.essay_helper.prompts import ESSAY_HELPER_SYSPROMPT_CONCEPTS as SYSPROMPT

from src.lm.lm import lm_model_essay as lm_model

from langchain_core.messages import HumanMessage, SystemMessage


async def generate_concept_response(question: str) -> PointsWithConceptsAfterLLMType:
    """
    Given a question, generate relevant concepts from vector db and elaborate
    on the concepts.
    """

    is_society_question = classify_society_qn(question)

    relevant_concepts = await get_relevant_concepts(
        question, is_singapore=is_society_question
    )

    await asyncio.gather(
        *(
            generate_elaborations_for_point(point_dict, question)
            for point_dict in (
                relevant_concepts.get("for_points")
                + relevant_concepts.get("against_points")
            )
        )
    )

    return relevant_concepts


async def generate_elaborations_for_point(
    point_dict: PointWithConceptsType, question: str
):
    """
    Given an essay topic sentence, generate elaborations for the point to the given dictionary.
    Augmented with concepts from vector db.
    """

    point = point_dict.get("point")
    concepts = point_dict.get("concepts")

    with Session(engine) as session:
        articles = session.scalars(
            select(Article).where(
                Article.id.in_([int(concept.get("article_id")) for concept in concepts])
            )
        ).all()
        articles_map = {article.id: article for article in articles}

    elaborated_concepts_with_index: list[tuple[PointWithConceptsAndLLMType, int]] = []
    await asyncio.gather(
        *(
            [
                generate_elaborated_concept(
                    question,
                    concept,
                    point,
                    elaborated_concepts_with_index,
                    index,
                    articles_map,
                )
                for index, concept in enumerate(concepts)
            ]
        )
    )
    elaborated_concepts_with_index.sort(key=lambda item: item[1])
    elaborated_concepts = [item[0] for item in elaborated_concepts_with_index]

    point_dict["concepts"] = elaborated_concepts


def format_prompt_input(
    question: str,
    concept: ArticleConceptLLMType,
    point: str,
    articles_map: dict[int, Article],
) -> str:
    article_id = concept.get("article_id")
    article = articles_map[int(article_id)]
    article_title = article.title
    article_body = article.body
    concept_content = concept.get("content")

    return f"""
    Essay Question: {question}
    Point: {point}
    Article_Title: {article_title}
    Article_Body: {article_body}
    Concept: {concept_content}
    """


async def generate_elaborated_concept(
    question: str,
    concept: ArticleConceptLLMType,
    point: str,
    elaborated_concepts: list[tuple[PointWithConceptsAndLLMType, int]],
    index: int,
    articles_map: dict[int, Article],
):
    """
    Given a concept and point, generate an essay paragraph elaborating using the concept.
    """
    prompt_input = format_prompt_input(question, concept, point, articles_map)

    messages = [
        SystemMessage(content=SYSPROMPT),
        HumanMessage(content=prompt_input),
    ]

    result = await lm_model.ainvoke(messages)

    concept["elaborations"] = result.content
    if concept["elaborations"] != "NOT RELEVANT":
        elaborated_concepts.append((concept, index))


async def get_relevant_concepts(
    question: str, concepts_per_point: int = 5, is_singapore: bool = False
) -> AllPointsWithConceptsType:
    """
    Given a question, generates topic sentences and adds vector db queried concepts to them.
    Returns a dictionary with for and against points and their relevant concepts.
    """
    points = await generate_points_from_question(question)

    for_pts = points.get("for_points", [])
    against_pts = points.get("against_points", [])

    relevant_results: AllPointsWithConceptsType = {
        "for_points": [],
        "against_points": [],
    }

    await asyncio.gather(
        *(
            [
                populate_point_with_concepts(
                    point,
                    concepts_per_point,
                    relevant_results.get("for_points"),
                    is_singapore,
                )
                for point in for_pts
            ]
            + [
                populate_point_with_concepts(
                    point,
                    concepts_per_point,
                    relevant_results.get("against_points"),
                    is_singapore,
                )
                for point in against_pts
            ]
        )
    )
    return relevant_results


async def populate_point_with_concepts(
    point: str,
    concepts_per_point: int,
    relevant_results: list[PointWithConceptsType],
    is_singapore: bool = False,
):
    """
    Given a topic sentence, query top k results from vector store,
    populate the result list with relevant concepts.
    """
    relevant_concepts = await get_similar_concepts(
        point, top_k=concepts_per_point, filter_sg=is_singapore
    )
    relevant_results.append({"point": point, "concepts": relevant_concepts})


if __name__ == "__main__":
    question = "Longer life expectancy creates more problems than benefits. Discuss."
    concepts = asyncio.run(generate_concept_response(question))
    print(json.dumps(concepts, indent=2))
