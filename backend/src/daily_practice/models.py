from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, and_, func
from src.common.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship, foreign
from src.essays.models import Comment, CommentParentType
from src.events.models import Article


class DailyPractice(Base):
    __tablename__ = "daily_practice"

    id: Mapped[int] = mapped_column(primary_key=True)

    practice_title: Mapped[str]
    practice_intro: Mapped[str]
    practice_hook_title: Mapped[str]
    practice_hook_question: Mapped[str]

    article_id: Mapped[int] = mapped_column(ForeignKey("article.id"))
    question: Mapped[str]
    date: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    attempts: Mapped[list["DailyPracticeAttempt"]] = relationship(
        back_populates="daily_practice"
    )

    article: Mapped[Article] = relationship("Article", backref="daily_practices")


class DailyPracticeAttempt(Base):
    __tablename__ = "daily_practice_attempt"

    id: Mapped[int] = mapped_column(primary_key=True)
    daily_practice_id: Mapped[int] = mapped_column(ForeignKey("daily_practice.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    comments = relationship(  # noqa: F821
        Comment,
        primaryjoin=and_(
            id == foreign(Comment.parent_id),
            Comment.parent_type == CommentParentType.DAILY_PRACTICE_ATTEMPT.value,
        ),
        backref="daily_practice_attempt",
    )

    daily_practice: Mapped[DailyPractice] = relationship(back_populates="attempts")
    points: Mapped[list["DailyPracticeAttemptPoint"]] = relationship(
        back_populates="daily_practice_attempt"
    )


class DailyPracticeAttemptPoint(Base):
    __tablename__ = "daily_practice_attempt_point"

    id: Mapped[int] = mapped_column(primary_key=True)
    daily_practice_attempt_id: Mapped[int] = mapped_column(
        ForeignKey("daily_practice_attempt.id")
    )
    content: Mapped[str]

    daily_practice_attempt: Mapped[DailyPracticeAttempt] = relationship(
        back_populates="points"
    )
