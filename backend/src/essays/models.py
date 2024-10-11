from enum import Enum
from sqlalchemy import ForeignKey, and_
from src.common.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship, foreign
from src.events.models import Analysis


class CommentParentType(str, Enum):
    ESSAY = "essay"
    PARAGRAPH = "paragraph"


class Inclination(str, Enum):
    GOOD = "good"
    NEUTRAL = "neutral"
    BAD = "bad"


class Comment(Base):
    __tablename__ = "comment"

    id: Mapped[int] = mapped_column(primary_key=True)
    parent_id: Mapped[int]
    parent_type: Mapped[CommentParentType]
    lack_example: Mapped[bool] = mapped_column(default=False)
    inclination: Mapped[Inclination]
    content: Mapped[str]

    comment_analysises: Mapped[list["CommentAnalysis"]] = relationship(
        back_populates="comment"
    )

    __mapper_args__ = {
        "polymorphic_on": "parent_type",
        "polymorphic_identity": "comment",
    }


class EssayComment(Comment):
    __mapper_args__ = {
        "polymorphic_on": "parent_type",
        "polymorphic_identity": CommentParentType.ESSAY.value,
    }


class ParagraphComment(Comment):
    __mapper_args__ = {
        "polymorphic_on": "parent_type",
        "polymorphic_identity": CommentParentType.PARAGRAPH.value,
    }


class CommentAnalysis(Base):
    __tablename__ = "comment_analysis"

    comment_id: Mapped[int] = mapped_column(ForeignKey("comment.id"), primary_key=True)
    skill_issue: Mapped[str]
    analysis_id: Mapped[int] = mapped_column(
        ForeignKey("analysis.id"), primary_key=True
    )

    comment: Mapped[Comment] = relationship(back_populates="comment_analysises")
    analysis: Mapped[Analysis] = relationship(backref="comment_analysises")


class Essay(Base):
    __tablename__ = "essay"

    id: Mapped[int] = mapped_column(primary_key=True)
    question: Mapped[str]
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    paragraphs: Mapped[list["Paragraph"]] = relationship(back_populates="essay")

    comments = relationship(
        Comment,
        primaryjoin=and_(
            id == foreign(Comment.parent_id),
            Comment.parent_type == CommentParentType.ESSAY.value,
        ),
        backref="essay",
    )


class ParagraphType(str, Enum):
    INTRODUCTION = "introduction"
    PARAGRAPH = "paragraph"
    CONCLUSION = "conclusion"


class Paragraph(Base):
    __tablename__ = "paragraph"

    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[ParagraphType]
    content: Mapped[str]
    essay_id: Mapped[int] = mapped_column(ForeignKey("essay.id"))

    essay: Mapped[Essay] = relationship(back_populates="paragraphs")

    comments = relationship(
        Comment,
        primaryjoin=and_(
            id == foreign(Comment.parent_id),
            Comment.parent_type == CommentParentType.PARAGRAPH.value,
        ),
        backref="paragraph",
    )
