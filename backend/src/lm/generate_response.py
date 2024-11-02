import json
from src.lm.generate_points import get_relevant_analyses
from src.lm.lm import lm_model_essay as lm_model
from langchain_core.messages import HumanMessage, SystemMessage
from src.lm.prompts import QUESTION_ANALYSIS_GEN_SYSPROMPT_2 as SYSPROMPT
from src.lm.prompts import (
    QUESTION_ANALYSIS_GEN_FALLBACK_SYSPROMPT as FALLBACK_SYSPROMPT,
)
from src.lm.society_classifier import classify_society_qn

from langchain_core.output_parsers import JsonOutputParser
from sqlalchemy.orm import Session
from src.common.database import engine
from sqlalchemy import select
from src.events.models import Event
import asyncio


def get_event_by_id(event_id: int) -> Event:
    with Session(engine) as session:
        result = session.scalars(select(Event).where(Event.id == event_id)).first()
        return result


def format_prompt_input(
    question: str, analysis: dict, point: str, events_map: dict[int, Event]
) -> str:
    event_id = analysis.get("event_id")
    event = events_map[int(event_id)]
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


async def get_elaborated_analysis(
    question, analysis, point, elaborated_analyses, index, events_map
):
    prompt_input = format_prompt_input(question, analysis, point, events_map)
    messages = [
        SystemMessage(content=SYSPROMPT),
        HumanMessage(content=prompt_input),
    ]

    result = await lm_model.ainvoke(messages)

    analysis["elaborations"] = result.content
    if analysis["elaborations"] != "NOT RELEVANT":
        elaborated_analyses.append((analysis, index))


async def process_point_dict(point_dict, question):
    point = point_dict.get("point")
    analyses = point_dict.get("analyses")
    with Session(engine) as session:
        events = session.scalars(
            select(Event).where(
                Event.id.in_([int(analysis.get("event_id")) for analysis in analyses])
            )
        ).all()
        events_map = {event.id: event for event in events}
    elaborated_analyses = []
    await asyncio.gather(
        *[
            get_elaborated_analysis(
                question, analysis, point, elaborated_analyses, index, events_map
            )
            for index, analysis in enumerate(analyses)
        ]
    )
    elaborated_analyses.sort(key=lambda item: item[1])
    elaborated_analyses = [item[0] for item in elaborated_analyses]

    point_dict["analyses"] = elaborated_analyses

    if len(elaborated_analyses) == 0:
        point_dict["fall_back_response"] = generate_fallback_response(question, point)


async def generate_response(question: str) -> dict:
    # NOTE: add a check to see if the question is a society question
    is_society_qn = classify_society_qn(question)
    relevant_analyses = await get_relevant_analyses(
        question, is_singapore=is_society_qn
    )

    await asyncio.gather(
        *[
            process_point_dict(point_dict, question)
            for point_dict in (
                relevant_analyses["for_points"] + relevant_analyses["against_points"]
            )
        ]
    )

    return relevant_analyses


def generate_fallback_response(question: str, point: str):
    messages = [
        SystemMessage(content=FALLBACK_SYSPROMPT),
        HumanMessage(content=f"Question: {question}\nPoint: {point}"),
    ]

    result = lm_model.invoke(messages)
    parser = JsonOutputParser()
    return parser.invoke(result)


if __name__ == "__main__":
    question = "Longer life expectancy creates more problems than benefits. Discuss."
    response = asyncio.run(generate_response(question))
    print(json.dumps(response, indent=2))
