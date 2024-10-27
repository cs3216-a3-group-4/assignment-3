from enum import Enum
from sqlalchemy import ForeignKey, ForeignKeyConstraint
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
    article_id: Mapped[int] = mapped_column(nullable=True)
    concept_id: Mapped[int] = mapped_column(nullable=True)
    type: Mapped[LikeType]
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    # relationships
    point = relationship("Point", backref="likes")
    analysis = relationship("Analysis", backref="likes")
    user = relationship("User", backref="likes")
    article_concept = relationship(
        "ArticleConcept",
        primaryjoin=(
            "and_(Like.concept_id == foreign(ArticleConcept.concept_id), "
            "Like.article_id == foreign(ArticleConcept.article_id))"
        ),
        backref="likes",
        uselist=True,
    )

    __table_args__ = (
        ForeignKeyConstraint(
            ["article_id", "concept_id"],
            ["article_concept.article_id", "article_concept.concept_id"],
        ),
    )
