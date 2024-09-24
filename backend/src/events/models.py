from enum import Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship, foreign
from sqlalchemy import Column, ForeignKey, Table, and_
from datetime import datetime
from src.common.base import Base
from src.notes.models import Note


class ArticleSource(str, Enum):
    CNA = "CNA"
    GUARDIAN = "GUARDIAN"


article_event_table = Table(
    "article_event",
    Base.metadata,
    Column("article_id", ForeignKey("article.id"), primary_key=True),
    Column("event_id", ForeignKey("event.id"), primary_key=True),
)


class Article(Base):
    __tablename__ = "article"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    summary: Mapped[str]
    body: Mapped[str]
    url: Mapped[str]
    source: Mapped[ArticleSource]
    date: Mapped[datetime]
    image_url: Mapped[str]

    original_events: Mapped[list["Event"]] = relationship(
        back_populates="original_article"
    )

    events: Mapped[list["Event"]] = relationship(
        back_populates="articles", secondary=article_event_table
    )

    notes = relationship(
        "Note",
        primaryjoin=and_(id == foreign(Note.parent_id), Note.parent_type == "article"),
        backref="article",
    )


class Event(Base):
    __tablename__ = "event"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    description: Mapped[str]
    duplicate: Mapped[bool]
    date: Mapped[datetime]
    is_singapore: Mapped[bool]
    original_article_id: Mapped[int] = mapped_column(ForeignKey("article.id"))
    rating: Mapped[int]

    categories: Mapped[list["Category"]] = relationship(
        back_populates="events", secondary="analysis"
    )

    analysises: Mapped[list["Analysis"]] = relationship(back_populates="event")

    original_article: Mapped[Article] = relationship(back_populates="original_events")
    articles: Mapped[list[Article]] = relationship(
        back_populates="events", secondary=article_event_table
    )
    gp_questions: Mapped[list["GPQuestion"]] = relationship(back_populates="event")

    notes = relationship(
        "Note",
        primaryjoin=and_(id == foreign(Note.parent_id), Note.parent_type == "note"),
        backref="event",
    )

    reads: Mapped[list["UserReadEvent"]] = relationship(backref="user")


class UserReadEvent(Base):
    __tablename__ = "user_read_event"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    event_id: Mapped[int] = mapped_column(ForeignKey("event.id"))
    first_read: Mapped[datetime]
    last_read: Mapped[datetime]


class Category(Base):
    __tablename__ = "category"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

    events: Mapped[list[Event]] = relationship(
        secondary="analysis", back_populates="categories"
    )
    analysises: Mapped[list["Analysis"]] = relationship(back_populates="category")


class Analysis(Base):
    __tablename__ = "analysis"

    id: Mapped[int] = mapped_column(primary_key=True)

    event_id: Mapped[int] = mapped_column(ForeignKey("event.id"))
    category_id: Mapped[int] = mapped_column(ForeignKey("category.id"))
    content: Mapped[str]

    event: Mapped[Event] = relationship(back_populates="analysises")
    category: Mapped[Category] = relationship(back_populates="analysises")


class GPQuestion(Base):
    __tablename__ = "gp_question"

    id: Mapped[int] = mapped_column(primary_key=True)
    question: Mapped[str]
    is_llm_generated: Mapped[bool] = mapped_column(default=True)
    event_id = mapped_column(ForeignKey("event.id"))

    categories: Mapped[list["Category"]] = relationship(
        secondary="gp_question_categories"
    )

    event: Mapped[Event] = relationship(back_populates="gp_questions")


class GPQuestionCategories(Base):
    __tablename__ = "gp_question_categories"

    gp_question_id: Mapped[int] = mapped_column(
        ForeignKey("gp_question.id"), primary_key=True
    )
    category_id: Mapped[int] = mapped_column(
        ForeignKey("category.id"), primary_key=True
    )
