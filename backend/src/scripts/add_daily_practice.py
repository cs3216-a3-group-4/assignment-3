import argparse
from datetime import datetime
from sqlalchemy.orm import Session
from src.common.database import engine
from src.daily_practice.models import DailyPractice


def add_daily_practice():
    parser = argparse.ArgumentParser()
    parser.add_argument("-a", "--article_id", help="article id", type=int)
    parser.add_argument("-q", "--question", help="question")
    args = parser.parse_args()

    with Session(engine) as session:
        daily_practice = DailyPractice(
            question=args.question, article_id=args.article_id, date=datetime.now()
        )
        session.add(daily_practice)
        session.commit()


if __name__ == "__main__":
    add_daily_practice()
