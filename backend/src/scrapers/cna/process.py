import argparse
import asyncio
import json
from sqlalchemy.orm import Session
from src.events.models import Article, ArticleSource
from src.common.database import engine
from pydantic import BaseModel, ConfigDict
from bs4 import BeautifulSoup
import os


parser = argparse.ArgumentParser()
parser.add_argument("-i", "--input", help="input folder path")

args = parser.parse_args()
folder_path = args.input


processed_ids = set()

CATEGORIES = [
    "Asia",
    "East Asia",
    "Singapore",
    "World",
    "Commentary",
    "CNA Explains",
    "Business",
    "Sport",
    "CNA Insider",
]


class CNAArticle(BaseModel):
    model_config = ConfigDict(extra="allow")

    type: str
    uuid: str
    nid: str
    title: str
    title_url: str
    absolute_url: str
    field_summary: str | None = None
    description: str | None = None
    release_date: str


async def process(category: str):
    with open(f"./src/scrapers/cna/data/{category}.json") as f:
        data = json.load(f)
    for page_index, page in enumerate(data):
        for index, item in enumerate(page):
            try:
                article = CNAArticle.model_validate(item)

                if article.type != "article":
                    continue
                if article.uuid in processed_ids:
                    continue
                processed_ids.add(article.uuid)

                # Read body text from scrape.py
                with open(
                    os.path.join(folder_path, f"{article.uuid}_{category}.txt")
                ) as f:
                    body = f.read()

                if not body.strip():
                    continue

                # Add to database
                article_orm = Article(
                    title=article.title,
                    summary=BeautifulSoup(article.description).getText()
                    if article.description
                    else "",
                    url=article.absolute_url,
                    source=ArticleSource.CNA,
                    body=body.strip(),
                    date=article.release_date,
                )
                with Session(engine) as session:
                    session.add(article_orm)
                    session.commit()

            except Exception as e:
                print(f"{category}: something went wrong with {page_index}, {index}")
                print(e)


async def process_all_categories():
    asyncio.gather(*[process(category) for category in CATEGORIES])


if __name__ == "__main__":
    asyncio.run(process_all_categories())
