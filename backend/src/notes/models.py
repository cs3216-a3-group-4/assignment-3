from sqlalchemy import Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.common.base import Base


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

    events = relationship("Event", secondary="event_note")


class EventNote(Base):
    __tablename__ = "event_note"

    event_id: Mapped[int] = mapped_column(ForeignKey("event.id"), primary_key=True)
    note_id: Mapped[int] = mapped_column(ForeignKey("note.id"), primary_key=True)
