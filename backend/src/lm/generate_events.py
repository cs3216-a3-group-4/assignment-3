import json

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.exceptions import OutputParserException
from langchain_core.output_parsers import JsonOutputParser
import openai

from src.scrapers.guardian.get_articles import get_articles
from typing import List
from pydantic import BaseModel
from src.lm.lm import CONCURRENCY, lm_model
from pydantic import ValidationError

from src.lm.prompts import EVENT_GEN_SYSPROMPT as SYSPROMPT
from src.lm.lm import HALLUCINATION_ATTEMPT_LIMIT
import asyncio


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
        if event_details is not None:
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
    attempts = 0
    events = None
    while attempts < HALLUCINATION_ATTEMPT_LIMIT:
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
        except OutputParserException as e:
            print(e)
            print("LM generated a bad response, skipping article ", article.id)
            break
        except ValidationError as e:
            print(e)
            print(
                "Validation error. Likely model hallucination at article ", article.id
            )
            attempts += 1
            if attempts < HALLUCINATION_ATTEMPT_LIMIT:
                print("Retrying article ", article.id)
                continue
            else:
                print("Exceeded attempt limit, skipping article ", article.id)
                break
        except openai.RateLimitError as e:
            print(e)
            print("hit the rate limit! waiting 10s for article", article.get("id"))
            await asyncio.sleep(10)
        except Exception as e:  # noqa: E722
            print(e)
            print("Something went wrong with article ", article.id)
            break
    return events


if __name__ == "__main__":
    articles = get_articles()
    print(len(articles))
    generate_events(articles)
