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
    useless: Mapped[bool] = mapped_column(server_default="false")

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
        primaryjoin=and_(id == foreign(Note.parent_id), Note.parent_type == "event"),
        backref="event",
    )

    reads: Mapped[list["UserReadEvent"]] = relationship(backref="user")
    bookmarks: Mapped[list["Bookmark"]] = relationship(back_populates="event")
    top_event_groups: Mapped[list["TopEventGroup"]] = relationship(
        back_populates="events", secondary="top_event_group_event"
    )


class TopEventGroup(Base):
    __tablename__ = "top_event_group"

    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[datetime]
    singapore_only: Mapped[bool]
    published: Mapped[bool] = mapped_column(server_default="false")

    events: Mapped[list[Event]] = relationship(
        back_populates="top_event_groups", secondary="top_event_group_event"
    )


class TopEventGroupEvent(Base):
    __tablename__ = "top_event_group_event"

    event_id: Mapped[int] = mapped_column(ForeignKey("event.id"), primary_key=True)
    top_event_group: Mapped[int] = mapped_column(
        ForeignKey("top_event_group.id"), primary_key=True
    )


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


class Concept(Base):
    __tablename__ = "concept"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True)

    analysis_concepts: Mapped[list["AnalysisConcept"]] = relationship(
        back_populates="concept"
    )


class AnalysisConcept(Base):
    __tablename__ = "analysis_concept"

    concept_id: Mapped[int] = mapped_column(ForeignKey("concept.id"), primary_key=True)
    analysis_id: Mapped[int] = mapped_column(
        ForeignKey("analysis.id"), primary_key=True
    )
    explanation: Mapped[str]

    analysis: Mapped["Analysis"] = relationship(back_populates="analysis_concepts")
    concept: Mapped["Concept"] = relationship(back_populates="analysis_concepts")


class Analysis(Base):
    __tablename__ = "analysis"

    id: Mapped[int] = mapped_column(primary_key=True)

    event_id: Mapped[int] = mapped_column(ForeignKey("event.id"))
    category_id: Mapped[int] = mapped_column(ForeignKey("category.id"))
    content: Mapped[str]

    event: Mapped[Event] = relationship(back_populates="analysises")
    category: Mapped[Category] = relationship(back_populates="analysises")

    notes = relationship(
        "Note",
        primaryjoin=and_(id == foreign(Note.parent_id), Note.parent_type == "analysis"),
        backref="analysis",
    )

    analysis_concepts: Mapped[list[AnalysisConcept]] = relationship(
        back_populates="analysis"
    )


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


class Bookmark(Base):
    __tablename__ = "bookmark"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("event.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    event: Mapped[Event] = relationship(back_populates="bookmarks")
