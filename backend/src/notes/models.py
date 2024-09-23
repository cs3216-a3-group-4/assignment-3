from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from src.common.base import Base
from enum import Enum


class NoteType(str, Enum):
    EVENT = "event"
    ARTICLE = "article"
    POINT = "point"


class Note(Base):
    __tablename__ = "note"

    id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str]

    start_index: Mapped[int]
    end_index: Mapped[int]

    parent_id: Mapped[int]
    parent_type: Mapped[str]

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

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
