from pydantic import BaseModel
from sqlalchemy import select
from src.lm.generate_events import CategoryAnalysis
from src.events.models import Analysis, Article, Category, Event
from src.common.database import engine
from sqlalchemy.orm import Session
from functools import cache


class EventLLM(BaseModel):
    """This is EventPublic from generate_events.py without the id field minus date plus rating"""

    title: str
    description: str
    analysis_list: list[CategoryAnalysis]
    duplicate: bool
    is_singapore: bool
    original_article_id: int
    # categories: list[str] --> derived from analysis list, not needed
    rating: int


@cache
def get_categories():
    with Session(engine) as session:
        categories = session.scalars(select(Category))
        if not categories:
            raise ValueError(
                "You don't have any categories in your db. Type `uv run src/scripts/seed.py`"
            )
        return {category.name: category.id for category in categories}


def add_event_to_db(event: EventLLM) -> bool:
    """Returns whether adding the event was successful.
    Can fail if category does not exist/article is invalid."""
    categories = get_categories()

    with Session(engine) as session:
        # Check for duplicates
        eventORM = session.scalars(
            select(Event).where(
                Event.title == event.title,
                Event.description == Event.description,
                Event.duplicate == event.duplicate,
                Event.is_singapore == event.is_singapore,
                Event.original_article_id == event.original_article_id,
            )
        ).first()
        if eventORM:
            print("duplicate detected:", event)
            return False

        try:
            article = session.get(Article, event.original_article_id)
            if not article:
                print(f"article {event.original_article_id} does not exist")
                raise ValueError()

            eventORM = Event(
                title=event.title,
                description=event.description,
                duplicate=False,
                date=article.date,
                is_singapore=event.is_singapore,
                original_article_id=event.original_article_id,
                rating=event.rating,
            )

            for analysis in event.analysis_list:
                category = analysis.category
                content = analysis.analysis

                # noticed a mismatch between seed and llm prompt
                if category == "Economic":
                    category = "Economics"

                analysisORM = Analysis(
                    category_id=categories[category], content=content
                )

                eventORM.analysises.append(analysisORM)

            session.add(eventORM)
            session.commit()

        except Exception as e:  # noqa: E722
            print("something went wrong:", event)
            print(e)
            return False


if __name__ == "__main__":
    # example usage
    add_event_to_db(
        EventLLM(
            title="test",
            description="test",
            analysis_list=[
                CategoryAnalysis(analysis="a", category="Science & Tech"),
                CategoryAnalysis(analysis="b", category="Media"),
            ],
            duplicate=False,
            rating=5,
            original_article_id=14,
            is_singapore=False,
        )
    )
