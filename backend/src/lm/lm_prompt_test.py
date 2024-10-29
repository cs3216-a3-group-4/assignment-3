import json
from langchain_core.messages import HumanMessage, SystemMessage
from src.events.models import Analysis
from langchain_core.output_parsers import JsonOutputParser
from src.lm.prompts import FILTER_USELESS_ARTICLES_SYSPROMPT as SYSPROMPT
from src.lm.lm import lm_model_concept as lm_model

from sqlalchemy import select
from sqlalchemy.orm import Session
from src.common.database import engine

with Session(engine) as session:
    query = select(Analysis).where(Analysis.event_id == 27593)
    analysis = session.execute(query).scalars().first()
    title = analysis.event.title
    event = analysis.event.description
    article = analysis.event.original_article

# title = "What does the colour of your pee say about your health?"
title = "Brazil institute sues social media giants for $525 million over excessive use by minors"
concept_human = f"""
    Article Title: {title}
"""

print(concept_human)


def test_lm_prompt():
    messages = [
        SystemMessage(
            content=SYSPROMPT,
        ),
        HumanMessage(content=concept_human),
    ]
    result = lm_model.invoke(messages)
    parser = JsonOutputParser()
    lm_output = parser.invoke(result)
    print(json.dumps(lm_output, indent=4))


if __name__ == "__main__":
    test_lm_prompt()
