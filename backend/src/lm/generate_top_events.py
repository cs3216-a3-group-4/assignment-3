import asyncio
from datetime import datetime, timedelta
from src.events.models import Article, Event, TopEventGroup
from src.common.database import engine
from sqlalchemy.orm import Session
from sqlalchemy import select
import logging

from src.lm.lm import lm_model
from src.lm.prompts import TOP_ARTICLES_PROMPT as SYSPROMPT

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import JsonOutputParser

TRIES = 5

# e.g. I request 15 articles if I need 10, a little space for hallucination
BUFFER = 5


async def generate_top_events(events: list[Event], count=10):
    if len(events) <= count:
        logging.warning(f"Less than {count} articles supplied to generate_top_events.")
        return events

    titles = [event.title for event in events]

    for _ in range(TRIES):
        try:
            messages = [
                SystemMessage(
                    content=SYSPROMPT.replace("{count}", str(count + BUFFER))
                ),
                HumanMessage(content=f"```\n{'\n'.join(titles)}\n```"),
            ]

            result = await lm_model.ainvoke(messages)
            print(result)
            parser = JsonOutputParser()
            response = parser.invoke(result)
            print(response)
            selected_titles = [
                title.lower().strip() for title in response.get("top_articles", [])
            ]
            print(response, len(response.get("top_articles", [])))
            events = [
                event
                for event in events
                if event.title.lower().strip() in selected_titles
            ]
            print(len(events))
            if len(events) < count:
                raise ValueError("Suspected hallucination, try again")
            events = events[:count]
            return events
        except Exception as e:  # noqa: E722
            print(e, type(e))
            await asyncio.sleep(10)


async def get_top_10_events_in_past_week(cutoff: datetime, is_singapore: bool = False):
    query = (
        select(Event)
        .where(Event.original_article.has(Article.useless == False))  # noqa: E712
        .where(Event.date >= cutoff)
        .where(Event.is_singapore == is_singapore)
    )

    with Session(engine) as session:
        qualifying_events = session.scalars(query).all()

    top_events = await generate_top_events(qualifying_events)
    return top_events


async def populate_article_groups():
    cutoff = datetime.now() - timedelta(days=7)
    global_events = await get_top_10_events_in_past_week(cutoff, is_singapore=False)
    sg_events = await get_top_10_events_in_past_week(cutoff, is_singapore=True)
    with Session(engine) as session:
        global_event_group = TopEventGroup(
            date=cutoff, singapore_only=False, published=True
        )
        global_event_group.events = global_events

        sg_event_group = TopEventGroup(date=cutoff, singapore_only=True, published=True)
        sg_event_group.events = sg_events
        session.add_all([global_event_group, sg_event_group])
        session.commit()


if __name__ == "__main__":
    asyncio.run(populate_article_groups())
