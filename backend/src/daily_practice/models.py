from datetime import datetime
from enum import StrEnum
from sqlalchemy import DateTime, ForeignKey, and_, func
from src.common.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship, foreign
from src.essays.models import Comment, CommentParentType


class DailyPractice(Base):
    __tablename__ = "daily_practice"

    id: Mapped[int] = mapped_column(primary_key=True)
    article_id: Mapped[int] = mapped_column(ForeignKey("article.id"))
    question: Mapped[str]
    date: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class DailyPracticeAttemptType(StrEnum):
    OUTLINE = "OUTLINE"
    PARAGRAPH = "PARAGRAPH"


class DailyPracticeAttempt(Base):
    __tablename__ = "daily_practice_attempt"

    id: Mapped[int] = mapped_column(primary_key=True)
    daily_practice_id: Mapped[int] = mapped_column(ForeignKey("daily_practice.id"))
    type: Mapped[DailyPracticeAttemptType]
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    content: Mapped[str]

    comments = relationship(  # noqa: F821
        Comment,
        primaryjoin=and_(
            id == foreign(Comment.parent_id),
            Comment.parent_type == CommentParentType.DAILY_PRACTICE_ATTEMPT.value,
        ),
        backref="daily_practice_attempt",
    )


class DailyPracticeAttemptPoint(Base):
    __tablename__ = "daily_practice_attempt_point"

    id: Mapped[int] = mapped_column(primary_key=True)
    daily_practice_attempt_id: Mapped[int] = mapped_column(
        ForeignKey("daily_practice_attempt.id")
    )
    content: Mapped[str]
