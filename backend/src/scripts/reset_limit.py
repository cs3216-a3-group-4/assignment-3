from sqlalchemy import update
from sqlalchemy.orm import Session
from src.common.database import engine
from src.limits.models import Usage


def reset_limit():
    with Session(engine) as session:
        session.execute(update(Usage).values(gp_question_asked=0))
        session.commit()


if __name__ == "__main__":
    reset_limit()
