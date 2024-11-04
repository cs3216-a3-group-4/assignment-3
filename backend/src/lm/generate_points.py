import asyncio
from typing import List
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel
from src.lm.dict_types import (
    AllPointsWithAnalysisType,
    PointWithAnalysisType,
    PointsType,
)
from src.lm.lm import lm_model_essay as lm_model
from src.embeddings.vector_store import get_similar_results

from src.lm.prompts import ROLE_SYSPROMPT as SYSPROMPT
from src.lm.prompts import QUESTION_POINT_GEN_SYSPROMPT as HUMAN_PROMPT


class Points(BaseModel):
    for_points: List[str]
    against_points: List[str]


async def generate_points_from_question(question: str) -> PointsType:
    human_message = HUMAN_PROMPT + question
    messages = [SystemMessage(content=SYSPROMPT), HumanMessage(content=human_message)]

    result = await lm_model.ainvoke(messages)
    parser = JsonOutputParser(pydantic_object=Points)
    points = parser.invoke(result)
    return points


async def populate_point(
    point: str,
    analyses_per_point: int,
    relevant_results: list[PointWithAnalysisType],
    is_singapore: bool = False,
):
    """
    Given a topic sentence, query top k results from vector store and populate the result list.
    """
    relevant_analyses = await get_similar_results(
        point, top_k=analyses_per_point, filter_sg=is_singapore
    )
    relevant_results.append({"point": point, "analyses": relevant_analyses})


async def get_relevant_analyses(
    question: str, analyses_per_point: int = 5, is_singapore: bool = False
) -> AllPointsWithAnalysisType:
    """
    Given a question, generate topic sentences and populate them with relevant analyses.
    """
    print(f"Freq penalty: {lm_model.frequency_penalty}")
    points = await generate_points_from_question(question)

    for_pts = points.get("for_points", [])
    against_pts = points.get("against_points", [])

    relevant_results: AllPointsWithAnalysisType = {
        "for_points": [],
        "against_points": [],
    }

    await asyncio.gather(
        *(
            [
                populate_point(
                    point,
                    analyses_per_point,
                    relevant_results.get("for_points"),
                    is_singapore,
                )
                for point in for_pts
            ]
            + [
                populate_point(
                    point,
                    analyses_per_point,
                    relevant_results.get("against_points"),
                    is_singapore,
                )
                for point in against_pts
            ]
        )
    )
    return relevant_results


if __name__ == "__main__":
    question = "Censorship is necessary. How true is this of your society?"
    # points = asyncio.run(generate_points_from_question(question))
    # print(points)
    relevant_analyses = asyncio.run(get_relevant_analyses(question, is_singapore=True))
    print(relevant_analyses)
