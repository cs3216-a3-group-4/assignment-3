from datetime import datetime
from sqlalchemy import select
from src.events.models import (
    Analysis,
    Article,
    ArticleSource,
    Category,
    Event,
    GPQuestion,
)
from sqlalchemy.orm import Session
from src.common.database import engine


def add_categories():
    CATEGORIES = [
        "Arts & Humanities",
        "Science & Tech",
        "Politics",
        "Media",
        "Environment",
        "Education",
        "Sports",
        "Gender & Equality",
        "Religion",
        "Society & Culture",
        "Economics",
    ]
    categories = [Category(name=category_name) for category_name in CATEGORIES]
    with Session(engine) as session:
        # If categories are already added, return
        if session.scalars(select(Category)).first() is not None:
            return
        session.add_all(categories)
        session.commit()


add_categories()


def test_associations():
    with Session(engine) as session:
        article = Article(
            title="test article",
            summary="test summary",
            url="https://whatever.com",
            source=ArticleSource.CNA,
            body="test body",
            date="2024-02-05",
            image_url="",
        )
        event = Event(
            title="test event 1",
            description="x",
            duplicate=False,
            date=datetime.now(),
            is_singapore=False,
            rating=5,
        )

        analysis = Analysis(category_id=1, content="hello")
        event.analysises.append(analysis)
        event.gp_questions.append(
            GPQuestion(question="whatever", is_llm_generated=False)
        )

        article.original_events.append(event)
        session.add(article)
        session.add(event)
        session.commit()

        session.refresh(article)
        session.refresh(event)
        print(article)
        print(event)
        event_id = event.id

    with Session(engine) as session:
        event_again = session.scalar(select(Event).where(Event.id == event_id))
        # categories = session.scalars(
        #     select(Category).where(Category.name.in_(["Environment", "Media"]))
        # )
        # event_again.categories.extend(categories)
        session.add(event_again)
        session.commit()

    with Session(engine) as session:
        event_again = session.scalar(select(Event).where(Event.id == event_id))
        print(event_again)
        print(event_again.original_article)
        print(event_again.categories)
        event_again.categories.clear()
        # original_article = event_again.original_article
        session.add(event_again)
        session.commit()
        # session.delete(event_again)
        # session.delete(original_article)


# test_associations()
