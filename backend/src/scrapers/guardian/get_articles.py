from src.common.database import engine
from sqlalchemy.orm import Session
from sqlalchemy import select
from src.events.models import Article


def get_articles() -> list[dict]:
    with Session(engine) as session:
        # Select the first 5 articles
        result = session.scalars(select(Article).limit(30))

        articles = []
        # Iterate over the result and print each article
        for article in result:
            data_dict = {
                "id": article.id,
                "bodyText": article.body,
            }
            articles.append(data_dict)

        return articles
