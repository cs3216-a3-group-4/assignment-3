import asyncio
from datetime import datetime, timedelta
from src.events.models import Article, Event
from src.common.database import engine
from sqlalchemy.orm import Session
from sqlalchemy import select
import logging

from src.lm.lm import lm_model
from src.lm.prompts import TOP_ARTICLES_PROMPT as SYSPROMPT

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import JsonOutputParser

TRIES = 5


async def generate_top_events(events: list[Event], count=10):
    if len(events) <= count:
        logging.warning(f"Less than {count} articles supplied to generate_top_events.")
        return events

    titles = [event.title for event in events]

    for _ in range(TRIES):
        try:
            messages = [
                SystemMessage(content=SYSPROMPT),
                HumanMessage(content=f"```\n{'\n'.join(titles)}\n```"),
            ]

            result = await lm_model.ainvoke(messages)
            parser = JsonOutputParser()
            response = parser.invoke(result)
            selected_titles = response.get("top_articles")
            print(response, len(response.get("top_articles")))
            events = [event for event in events if event.title in selected_titles]
            if len(events) != count:
                raise ValueError("Suspected hallucination, try again")
        except Exception as e:  # noqa: E722
            print(e)
            await asyncio.sleep(10)


async def get_top_10_events_in_past_week(is_singapore: bool = False):
    last_week = datetime.now() - timedelta(days=7)
    query = (
        select(Event)
        .where(Event.original_article.has(Article.useless == False))  # noqa: E712
        .where(Event.date > last_week)
        .where(Event.is_singapore == is_singapore)
    )

    with Session(engine) as session:
        qualifying_events = session.scalars(query).all()

    top_events = await generate_top_events(qualifying_events)
    return top_events


if __name__ == "__main__":
    asyncio.run(get_top_10_events_in_past_week())
