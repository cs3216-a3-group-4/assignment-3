import asyncio
from datetime import datetime, timedelta, time
import httpx
import os

from src.common.constants import GUARDIAN_API_KEY
from sqlalchemy import select
from src.embeddings.vector_store import store_documents
from src.events.models import Article, ArticleSource, Event
from src.common.database import engine
from sqlalchemy.orm import Session
from src.scrapers.cna.process import process_all_categories
from src.scrapers.cna.scrape import scrape_from_date
from src.scrapers.guardian.get_analyses import get_analyses
from src.scrapers.guardian.process import GuardianArticle, GuardianArticleFields

from src.lm.generate_events import generate_events
from src.scripts.populate import populate


def query_page(page: int, date):
    response = httpx.get(
        "https://content.guardianapis.com/search",
        params={
            "api-key": GUARDIAN_API_KEY,
            "page-size": 50,
            "page": page,
            "lang": "en",
            "show-fields": ["all"],
            "from-date": date,
        },
    )
    response_json = response.json()
    data = response_json["response"]
    if data["status"] != "ok":
        print("something went wrong with page:", page)
        return []
    return data["results"]


def get_today_articles():
    result = []
    cur_date = datetime.now().date() - timedelta(days=1)
    for i in range(1, 11):
        new_batch = query_page(i, cur_date)
        if len(new_batch) < 50:
            print(f"On page {i}, only got {len(new_batch)} articles. Stopping.")
            result += new_batch
            break
        print(f"On page {i}, got {len(new_batch)} articles")
        result += new_batch

    return result


def form_guardian_article_obj(article: dict):
    article_obj = GuardianArticle(
        fields=GuardianArticleFields(
            bodyText=article["fields"]["bodyText"],
            trailText=article["fields"]["trailText"],
            thumbnail=article["fields"]["thumbnail"],
        ),
        webUrl=article["webUrl"],
        webTitle=article["webTitle"],
        webPublicationDate=article["webPublicationDate"],
    )
    return article_obj


def add_daily_articles_to_db(article: GuardianArticle):
    with Session(engine) as session:
        query_article = session.scalars(
            select(Article).where(
                Article.title == article.webTitle,
                Article.source == ArticleSource.GUARDIAN,
                Article.date == article.webPublicationDate,
                Article.url == article.webUrl,
            )
        ).first()

        if query_article:
            print(f"Article {article.webTitle} already exists in database")
            return False

        try:
            article_orm = Article(
                title=article.webTitle,
                summary=article.fields.trailText if article.fields.trailText else "",
                url=article.webUrl,
                source=ArticleSource.GUARDIAN,
                body=article.fields.bodyText,
                date=article.webPublicationDate,
                image_url=article.fields.thumbnail or "",
            )
            session.add(article_orm)
            session.commit()
            print(
                f"Added {article.webTitle} to database at {article.webPublicationDate}"
            )
        except Exception as e:
            print(f"Something went wrong with article {article.webTitle}")
            print(e)
            return False


def populate_daily_articles():
    articles = get_today_articles()
    articles = articles[:20]
    for article in articles:
        article_obj = form_guardian_article_obj(article)
        add_daily_articles_to_db(article_obj)


async def populate_daily_articles_cna():
    # create articles folder if doesnt exist
    if "articles" not in os.listdir("./src/scrapers/cna"):
        os.mkdir("./src/scrapers/cna/articles")

    yesterday = datetime.combine(datetime.now() - timedelta(days=1), time.min)

    # this function doesnt care about duplicates and just destroys the json
    await scrape_from_date(start_date=yesterday)
    # this function already checks for articles not in db that are in json
    # may salvage the broken json
    await process_all_categories("./src/scrapers/cna/articles")


def process_new_articles():
    with Session(engine) as session:
        result = session.scalars(
            select(Article).where(
                Article.id.not_in(
                    list(session.scalars(select(Event.original_article_id)))
                )
            )
        ).all()

        articles = []
        # Iterate over the result and print each article
        for article in result:
            data_dict = {
                "id": article.id,
                "bodyText": article.body,
            }
            articles.append(data_dict)

        return articles


# NOTE: this method should work with no issue as long as the number of calls is less than 500 which is the rate limit by OpenAI
# This should not be an issue as long as we ensure the 25k articles in the database have already been processed


async def run(limit: int = 30):
    # Add new articles to database
    await populate_daily_articles_cna()
    # ADD CNA HERE.
    # Process new articles i.e. find articles that we have not generated events for
    articles = process_new_articles()
    # # Generate events from articles, written to lm_events_output.json
    await generate_events(articles)

    event_ids = populate("lm_events_output.json")
    analyses = get_analyses(event_ids)

    store_documents(analyses)
    print(analyses)


if __name__ == "__main__":
    asyncio.run(run(1000))
