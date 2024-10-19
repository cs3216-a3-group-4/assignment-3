from langchain_core.messages import HumanMessage, SystemMessage
from src.events.models import Analysis
from src.lm.concept_gen_prompt import CONCEPT_GEN_SYSPROMPT as SYSPROMPT
from src.lm.lm import lm_model

from sqlalchemy import exists, select
from sqlalchemy.orm import Session, selectinload
from src.common.database import engine

with Session(engine) as session:
    query = select(Analysis).where(Analysis.event_id == 27193)
    analysis = session.execute(query).scalars().first()
    title = analysis.event.title
    event = analysis.event.description
    article = analysis.event.original_article.body

concept_human = f"""
    Event Title: {title}
    Event Description: {article}
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
    print(result.content)


if __name__ == "__main__":
    test_lm_prompt()
