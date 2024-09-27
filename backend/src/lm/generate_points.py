from typing import List
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel
from src.lm.generate_events import lm_model_essay as lm_model
from src.embeddings.vector_store import get_similar_results

from src.lm.prompts import QUESTION_POINT_GEN_SYSPROMPT as SYSPROMPT


class Points(BaseModel):
    for_points: List[dict]
    against_points: List[dict]


def generate_points_from_question(question: str) -> dict:
    messages = [SystemMessage(content=SYSPROMPT), HumanMessage(content=question)]

    result = lm_model.invoke(messages)
    parser = JsonOutputParser(pydantic_object=Points)
    points = parser.invoke(result)
    return points


def get_relevant_analyses(question: str, analyses_per_point: int = 5) -> dict:
    print(f"Freq penalty: {lm_model.frequency_penalty}")
    points = generate_points_from_question(question)

    for_pts = points.get("for_points", [])
    against_pts = points.get("against_points", [])

    relevant_results = {"for_points": [], "against_points": []}
    for point in for_pts:
        relevant_analyses = get_similar_results(point, top_k=analyses_per_point)
        relevant_results.get("for_points").append(
            {"point": point, "analyses": relevant_analyses}
        )

    for point in against_pts:
        relevant_analyses = get_similar_results(point, top_k=analyses_per_point)
        relevant_results.get("against_points").append(
            {"point": point, "analyses": relevant_analyses}
        )

    return relevant_results


if __name__ == "__main__":
    question = "Should the government provide free education for all citizens?"
    relevant_analyses = get_relevant_analyses(question)
    print(relevant_analyses)
