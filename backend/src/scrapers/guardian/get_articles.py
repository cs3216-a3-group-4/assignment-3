from src.common.database import engine
from sqlalchemy.orm import Session
from sqlalchemy import select
from src.events.models import Article


def get_articles():
    with Session(engine) as session:
        # Select the first 5 articles
        result = session.scalars(select(Article).limit(5))

        # Iterate over the result and print each article
        for article in result:
            print(article.title)


if __name__ == "__main__":
    get_articles()
