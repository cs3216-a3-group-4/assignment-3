from enum import Enum
from sqlalchemy import ForeignKey
from src.common.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship


class LikeType(int, Enum):
    LIKE = 1
    DISLIKE = -1


class Like(Base):
    __tablename__ = "like"
    id: Mapped[int] = mapped_column(primary_key=True)
    point_id: Mapped[int] = mapped_column(ForeignKey("point.id"), nullable=True)
    analysis_id: Mapped[int] = mapped_column(ForeignKey("analysis.id"), nullable=True)
    concept_id: Mapped[int] = mapped_column(ForeignKey("concept.id"), nullable=True)
    type: Mapped[LikeType]
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    # relationships
    point = relationship("Point", backref="likes")
    analysis = relationship("Analysis", backref="likes")
    concept = relationship("Concept", backref="likes")
    user = relationship("User", backref="likes")
