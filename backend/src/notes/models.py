from sqlalchemy import Enum
from sqlalchemy.orm import Mapped, mapped_column
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

    __mapper_args__ = {"polymorphic_on": "parent_type", "polymorphic_identity": "note"}
