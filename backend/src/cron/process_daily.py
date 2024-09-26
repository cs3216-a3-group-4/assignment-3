import asyncio
import json
from typing import List

from sqlalchemy.orm import Session
from sqlalchemy import select
from src.common.database import engine

from src.embeddings.vector_store import store_documents
from src.events.models import Analysis

from src.lm.generate_events import (
    CONCURRENCY,
    EventPublic,
    form_event_json,
    generate_events_from_article,
)
from src.scripts.populate import populate

file_path = "daily_events.json"


async def generate_daily_events(articles: list[dict]) -> List[EventPublic]:
    res = []
    semaphore = asyncio.Semaphore(CONCURRENCY)
    async with asyncio.TaskGroup() as tg:
        for article in articles:
            tg.create_task(generate_daily_event(article, res, semaphore))

    with open(file_path, "w") as json_file:
        json.dump(res, json_file, indent=4)
    return res


async def generate_daily_event(article: dict, res: list, semaphore: asyncio.Semaphore):
    async with semaphore:
        event_details = await generate_events_from_article(article)
        for example in event_details.get("examples"):
            res.append(form_event_json(example, article))
        await asyncio.sleep(1)


# def store_daily_analyses(events: List[EventLLM]):
#     for event in events:
#         event.analysis_list.


async def process_daily_articles(articles: list[dict]):
    await generate_daily_events(articles)
    events_ids = populate(file_path=file_path)

    with Session(engine) as session:
        analyses = session.scalars(
            select(Analysis).where(Analysis.event_id.in_(events_ids))
        )

        store_documents(analyses)
