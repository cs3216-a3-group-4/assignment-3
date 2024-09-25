from src.lm.generate_points import get_relevant_analyses
from src.lm.generate_events import lm_model
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import JsonOutputParser
from src.lm.prompts import QUESTION_ANALYSIS_GEN_SYSPROMPT as SYSPROMPT
import json

from sqlalchemy.orm import Session
from src.common.database import engine
from sqlalchemy import select
from src.events.models import Event


class Elaborations(BaseModel):
    for_points: list[str]
    against_points: list[str]


def format_analyses(relevant_analyses: dict, question: str):
    # Given relevant analyses
    # for each point add an elaboration and delete score
    return {
        "question": question,
        "for_points": [
            {
                "point": point["point"],
                "examples": [
                    {
                        "event_title": get_event_by_id(point["event_id"]).title,
                        "event_description": get_event_by_id(
                            point["event_id"]
                        ).description,
                        "analysis": analysis["content"],
                    }
                    for analysis in point["analyses"]
                ],
            }
            for point in relevant_analyses["for_points"]
        ],
        "against_points": [
            {
                "point": point["point"],
                "examples": [
                    {
                        "event": get_event_by_id(point["event_id"]).title,
                        "event_description": get_event_by_id(
                            point["event_id"]
                        ).description,
                        "analysis": analysis["content"],
                    }
                    for analysis in point["analyses"]
                ],
            }
            for point in relevant_analyses["against_points"]
        ],
    }


def get_event_by_id(event_id: int) -> Event:
    with Session(engine) as session:
        result = session.scalars(select(Event).where(Event.id == event_id)).first()
        return result


def generate_response(question: str) -> dict:
    relevant_analyses = get_relevant_analyses(question)
    messages = [
        SystemMessage(content=SYSPROMPT),
        HumanMessage(content=json.dumps(relevant_analyses)),
    ]

    result = lm_model.invoke(messages)
    parser = JsonOutputParser(pydantic_object=Elaborations)
    elaborations = parser.invoke(result)
    return elaborations
