from src.lm.generate_points import get_relevant_analyses
from src.lm.generate_events import lm_model
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import JsonOutputParser
from src.lm.prompts import QUESTION_ANALYSIS_GEN_SYSPROMPT_2 as SYSPROMPT
import json

from sqlalchemy.orm import Session
from src.common.database import engine
from sqlalchemy import select
from src.events.models import Event


def get_event_by_id(event_id: int) -> Event:
    with Session(engine) as session:
        result = session.scalars(select(Event).where(Event.id == event_id)).first()
        return result


def format_prompt_input(question: str, analysis: dict, point: str) -> str:
    event_id = analysis.get("event_id")
    event = get_event_by_id(event_id)
    event_title = event.title
    event_description = event.description
    analysis_content = analysis.get("content")

    return f"""
    Question: {question}
    Point: {point}
    Event_Title: {event_title}
    Event_Description: {event_description}
    Analysis: {analysis_content}
    """


def generate_response(question: str) -> dict:
    relevant_analyses = get_relevant_analyses(question)

    for point_dict in (
        relevant_analyses["for_points"] + relevant_analyses["against_points"]
    ):
        point = point_dict.get("point")
        analyses = point_dict.get("analyses")
        elaborated_analyses = []
        for analysis in analyses:
            prompt_input = format_prompt_input(question, analysis, point)
            messages = [
                SystemMessage(content=SYSPROMPT),
                HumanMessage(content=prompt_input),
            ]

            result = lm_model.invoke(messages)

            analysis["elaborations"] = result.content
            if analysis["elaborations"] != "NOT RELEVANT":
                elaborated_analyses.append(analysis)

        point_dict["analyses"] = elaborated_analyses
    return relevant_analyses

    # formatted_analyses = format_analyses(relevant_analyses, question)
    # messages = [
    #     SystemMessage(content=SYSPROMPT),
    #     HumanMessage(content=json.dumps(formatted_analyses)),
    # ]

    # result = lm_model.invoke(messages)
    # parser = JsonOutputParser(pydantic_object=Elaborations)
    # elaborations = parser.invoke(result)
    # return elaborations


if __name__ == "__main__":
    question = "Should the government provide free education for all citizens?"
    print(generate_response(question))
