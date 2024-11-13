from datetime import datetime
from sqlalchemy.orm import Session
from src.common.database import engine
from src.daily_practice.models import DailyPractice


def add_daily_practice():
    # parser = argparse.ArgumentParser()
    # parser.add_argument("-a", "--article_id", help="article id", type=int)
    # parser.add_argument("-q", "--question", help="question")

    article_id = 17889
    question = "To what extent should governments and communities be responsible for ensuring digital inclusivity for the elderly?"

    practice_title = "Bridging the Digital Divide: Are We Leaving Our Elderly Behind?"
    practice_intro = "As our world becomes increasingly digital, we must pause and consider how this shift is affecting different segments of society, particularly the elderly. With technology advancing at an unprecedented rate, many older individuals find themselves excluded, struggling to adapt to the digital tools that have become central to daily life. Today, we’ll explore the growing digital divide and the social consequences it brings, from isolation to missed opportunities. Understanding these challenges is crucial, as the push for digital inclusion becomes not only a technological concern but a moral one. Let’s examine how we can bridge this gap and ensure that progress benefits everyone."
    practice_hook_title = "In the rush towards a digital future, could we be leaving our elderly behind? Today’s focus explores the risks of social isolation linked to the digital divide."
    practice_hook_question = (
        "Are we truly creating an inclusive digital future for all generations?"
    )

    # args = parser.parse_args()

    with Session(engine) as session:
        daily_practice = DailyPractice(
            # question=args.question,
            # article_id=args.article_id,
            question=question,
            article_id=article_id,
            date=datetime.now(),
            practice_title=practice_title,
            practice_intro=practice_intro,
            practice_hook_title=practice_hook_title,
            practice_hook_question=practice_hook_question,
        )
        session.add(daily_practice)
        session.commit()


if __name__ == "__main__":
    add_daily_practice()
