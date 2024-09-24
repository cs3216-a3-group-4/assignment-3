from src.common.database import engine
from sqlalchemy.orm import Session
from sqlalchemy import select
from src.events.models import Analysis


def get_analyses():
    with Session(engine) as session:
        # Select the first 5 articles
        result = session.scalars(select(Analysis))

        analyses = []
        # Iterate over the result and print each article
        for analysis in result:
            data_dict = {
                "id": analysis.id,
                "event_id": analysis.event_id,
                "category_id": analysis.category_id,
                "content": analysis.content,
            }
            analyses.append(data_dict)

        return analyses


if __name__ == "__main__":
    print(len(get_analyses()))
