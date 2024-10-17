"""This script is intended to be used ONCE to filter all articles in your database."""

import asyncio
from sqlalchemy import select, update
from sqlalchemy.orm import Session
from src.common.database import engine
from src.events.models import Article
from src.lm.evaluate_article import check_article_title
from src.lm.lm import CONCURRENCY


async def filter_article(
    article: Article, res: list[int], semaphore: asyncio.Semaphore
):
    async with semaphore:
        useful = await check_article_title(article.title)
        if not useful:
            res.append(article.id)
        await asyncio.sleep(1)


async def filter_articles(limit: int = None):
    res: list[int] = []
    with Session(engine) as session:
        query = select(Article)
        if limit:
            query = query.order_by(Article.id).limit(limit)
        articles = session.scalars(query)
        semaphore = asyncio.Semaphore(CONCURRENCY)
        async with asyncio.TaskGroup() as tg:
            for article in articles:
                tg.create_task(filter_article(article, res, semaphore))

        session.execute(update(Article).where(Article.id.in_(res)).values(useless=True))
        session.commit()


if __name__ == "__main__":
    asyncio.run(filter_articles())
