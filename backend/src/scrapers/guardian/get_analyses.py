from src.common.database import engine
from sqlalchemy.orm import Session
from sqlalchemy import select
from src.events.models import Analysis


def get_analyses():
    with Session(engine) as session:
        # Select the first 5 articles
        result = session.scalars(select(Analysis))
        return result


if __name__ == "__main__":
    print(len(get_analyses()))
