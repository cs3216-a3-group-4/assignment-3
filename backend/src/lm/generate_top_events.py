import asyncio
from datetime import datetime, timedelta
from src.events.models import Article, Event, TopArticleGroup
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


async def generate_top_articles(articles: list[Article], count=10):
    if len(articles) <= count:
        logging.warning(
            f"Less than {count} articles supplied to generate_top_articles."
        )
        return articles

    titles = [article.title for article in articles]

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
            articles = [
                article
                for article in articles
                if article.title.lower().strip() in selected_titles
            ]
            print(len(articles))
            if len(articles) < count:
                raise ValueError("Suspected hallucination, try again")
            articles = articles[:count]
            return articles
        except Exception as e:  # noqa: E722
            print(e, type(e))
            await asyncio.sleep(10)


async def get_top_10_articles_in_past_week(
    cutoff: datetime, is_singapore: bool = False
):
    query = (
        select(Article)
        .where(Article.useless == False)  # noqa: E712
        .where(Article.date >= cutoff)
        .where(Article.original_events.any())
    )

    if is_singapore:
        query = query.where(Article.original_events.any(Event.is_singapore == True))  # noqa: E712
    else:
        query = query.where(~Article.original_events.any(Event.is_singapore == True))  # noqa: E712

    with Session(engine) as session:
        qualifying_articles = session.scalars(query).all()

    top_articles = await generate_top_articles(qualifying_articles)
    return top_articles


async def populate_article_groups():
    cutoff = datetime.now() - timedelta(days=7)
    global_articles = await get_top_10_articles_in_past_week(cutoff, is_singapore=False)
    sg_articles = await get_top_10_articles_in_past_week(cutoff, is_singapore=True)
    with Session(engine) as session:
        global_article_group = TopArticleGroup(
            date=cutoff, singapore_only=False, published=True
        )
        global_article_group.articles = global_articles

        sg_article_group = TopArticleGroup(
            date=cutoff, singapore_only=True, published=True
        )
        sg_article_group.articles = sg_articles
        session.add_all([global_article_group, sg_article_group])
        session.commit()


if __name__ == "__main__":
    asyncio.run(populate_article_groups())
