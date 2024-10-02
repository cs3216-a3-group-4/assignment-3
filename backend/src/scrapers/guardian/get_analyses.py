from src.common.database import engine
from sqlalchemy.orm import Session
from sqlalchemy import select
from src.events.models import Analysis


def get_analyses(event_ids: list[int]):
    with Session(engine) as session:
        # Select the first 5 articles
        result = session.scalars(
            select(Analysis).where(Analysis.event_id.in_(event_ids))
        )
        return result.all()


if __name__ == "__main__":
    print(get_analyses([0, 1, 2, 3])[0].content)

