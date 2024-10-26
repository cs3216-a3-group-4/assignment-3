from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.common.base import Base
from enum import Enum


class NoteType(str, Enum):
    EVENT = "event"
    ARTICLE = "article"
    POINT = "point"
    ANALYSIS = "analysis"
    CONCEPT = "concept"


class Note(Base):
    __tablename__ = "note"

    id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str]

    start_index: Mapped[int] = mapped_column(nullable=True)
    end_index: Mapped[int] = mapped_column(nullable=True)

    parent_id: Mapped[int]
    parent_type: Mapped[str]

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    category_id: Mapped[int] = mapped_column(ForeignKey("category.id"), nullable=True)

    category = relationship("Category", backref="notes")

    __mapper_args__ = {"polymorphic_on": "parent_type", "polymorphic_identity": "note"}


class EventNote(Note):
    __mapper_args__ = {
        "polymorphic_on": "parent_type",
        "polymorphic_identity": "event",
    }


class ArticleNote(Note):
    __mapper_args__ = {
        "polymorphic_on": "parent_type",
        "polymorphic_identity": "article",
    }


class PointNote(Note):
    __mapper_args__ = {
        "polymorphic_on": "parent_type",
        "polymorphic_identity": "point",
    }


class AnalysisNote(Note):
    __mapper_args__ = {
        "polymorphic_on": "parent_type",
        "polymorphic_identity": "analysis",
    }


class ConceptNote(Note):
    __mapper_args__ = {
        "polymorphic_on": "parent_type",
        "polymorphic_identity": "concept",
    }
