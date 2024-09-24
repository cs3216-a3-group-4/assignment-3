from src.common.database import engine
from sqlalchemy.orm import Session
from sqlalchemy import select
from src.events.models import Analysis


def get_analyses():
    with Session(engine) as session:
        # Select the first 5 articles
        result = session.scalars(select(Analysis).limit(5))

        analyses = []
        # Iterate over the result and print each article
        for article in result:
            data_dict = {
                "id": article.id,
                "event_id": article.event_id,
                "category_id": article.category_id,
                "content": article.content,
            }
            analyses.append(data_dict)

        return analyses


if __name__ == "__main__":
    print(len(get_analyses()))
