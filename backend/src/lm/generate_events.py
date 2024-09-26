import json
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import JsonOutputParser
import openai
from src.scrapers.guardian.get_articles import get_articles
from typing import List
from pydantic import BaseModel
from src.common.constants import LANGCHAIN_API_KEY
from src.common.constants import LANGCHAIN_TRACING_V2
from src.common.constants import OPENAI_API_KEY
from src.lm.prompts import EVENT_GEN_SYSPROMPT as SYSPROMPT
import asyncio

import os

os.environ["LANGCHAIN_API_KEY"] = LANGCHAIN_API_KEY
os.environ["LANGCHAIN_TRACING_V2"] = LANGCHAIN_TRACING_V2
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

lm_model = ChatOpenAI(model="gpt-4o-mini", temperature=0.7, max_retries=5)


class CategoryAnalysis(BaseModel):
    category: str
    analysis: str


class EventPublic(BaseModel):
    id: int
    title: str
    description: str
    analysis_list: list[CategoryAnalysis]
    duplicate: bool
    date: str
    is_singapore: bool
    original_article_id: int
    categories: list[str]
    questions: list[str]


class Example(BaseModel):
    event_title: str
    description: str
    questions: list[str]
    analysis_list: list[CategoryAnalysis]
    category: list[str]
    in_singapore: bool
    rating: int


class EventDetails(BaseModel):
    examples: list[Example]


file_path = "lm_events_output.json"

CONCURRENCY = 150


async def generate_events(articles: list[dict]) -> List[EventPublic]:
    res = []
    semaphore = asyncio.Semaphore(CONCURRENCY)
    async with asyncio.TaskGroup() as tg:
        for article in articles:
            tg.create_task(generate_event(article, res, semaphore))

    with open(file_path, "w") as json_file:
        json.dump(res, json_file, indent=4)
    return res


async def generate_event(article: dict, res: list, semaphore: asyncio.Semaphore):
    async with semaphore:
        event_details = await generate_events_from_article(article)
        for example in event_details.get("examples"):
            res.append(form_event_json(example, article))
        await asyncio.sleep(1)


def form_event_json(event_details, article) -> dict:
    return EventPublic(
        id=0,
        title=event_details.get("event_title", ""),
        description=event_details.get("description", ""),
        analysis_list=event_details.get("analysis_list", {}),
        duplicate=False,
        date=str(article.get("webPublicationDate")),
        is_singapore=event_details.get("in_singapore", False),
        categories=event_details.get("category", []),
        original_article_id=article.get("id"),
        questions=event_details.get("questions", []),
    ).model_dump()


"""
Generate a batch of prompts for OpenAI Batch API to generate events from articles
"""


async def generate_events_from_article(article: dict) -> dict:
    while True:
        try:
            article_body = article.get("bodyText")
            messages = [
                SystemMessage(content=SYSPROMPT),
                HumanMessage(content=article_body),
            ]

            result = await lm_model.ainvoke(messages)
            parser = JsonOutputParser(pydantic_object=EventDetails)
            events = parser.invoke(result)
            print(f"Model temp: {lm_model.temperature}")
            break
        except openai.RateLimitError:
            print("hit the rate limit! waiting 10s for article", article.get("id"))
            await asyncio.sleep(10)
    return events


if __name__ == "__main__":
    articles = get_articles()
    print(len(articles))
    generate_events(articles)
