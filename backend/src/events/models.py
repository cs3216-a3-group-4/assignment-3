from enum import Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from datetime import datetime
from src.common.base import Base


class ArticleSource(str, Enum):
    CNA = "CNA"
    GUARDIAN = "GUARDIAN"


class Article(Base):
    __tablename__ = "article"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    summary: Mapped[str]
    body: Mapped[str]
    url: Mapped[str]
    source: Mapped[ArticleSource]


class Event(Base):
    __tablename__ = "event"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    description: Mapped[str]
    analysis: Mapped[str]
    duplicate: Mapped[bool]
    date: Mapped[datetime]

    categories: Mapped[list["Category"]] = relationship(
        back_populates="events", secondary="event_category"
    )


class Category(Base):
    __tablename__ = "category"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

    events: Mapped[list[Event]] = relationship(
        secondary="event_category", back_populates="categories"
    )


class EventCategory(Base):
    __tablename__ = "event_category"

    event_id: Mapped[int] = mapped_column(ForeignKey("event.id"), primary_key=True)
    category_id: Mapped[int] = mapped_column(
        ForeignKey("category.id"), primary_key=True
    )
