import argparse

import json
from sqlalchemy.orm import Session
from src.events.models import Article, ArticleSource
from src.common.database import engine
from pydantic import BaseModel, ConfigDict
from bs4 import BeautifulSoup
import os
from pprint import pprint


parser = argparse.ArgumentParser()
parser.add_argument("-i", "--input", help="input folder path")
args = parser.parse_args()


class GuardianArticleFields(BaseModel):
    model_config = ConfigDict(extra="allow")
    bodyText: str
    trailText: str | None = None


class GuardianArticle(BaseModel):
    model_config = ConfigDict(extra="allow")
    fields: GuardianArticleFields
    webUrl: str
    webTitle: str
    webPublicationDate: str


with open(args.input) as f:
    data = json.load(f)
    for row in data:
        article = GuardianArticle.model_validate(row)
        article_orm = Article(
            title=article.webTitle,
            summary=article.fields.trailText if article.fields.trailText else "",
            url=article.webUrl,
            source=ArticleSource.GUARDIAN,
            body=article.fields.bodyText,
            date=article.webPublicationDate,
        )
        with Session(engine) as session:
            session.add(article_orm)
            session.commit()
