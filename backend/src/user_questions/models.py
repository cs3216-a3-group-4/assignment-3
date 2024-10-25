from sqlalchemy import ForeignKey, ForeignKeyConstraint, and_
from src.common.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship, foreign
from src.events.models import Analysis, ArticleConcept
from src.notes.models import Note


class UserQuestion(Base):
    __tablename__ = "user_question"

    id: Mapped[int] = mapped_column(primary_key=True)
    question: Mapped[str]

    answer: Mapped["Answer"] = relationship(back_populates="user_question")

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))


class Answer(Base):
    __tablename__ = "answer"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_question_id: Mapped[int] = mapped_column(ForeignKey("user_question.id"))

    user_question: Mapped[UserQuestion] = relationship(back_populates="answer")

    points: Mapped[list["Point"]] = relationship(back_populates="answer")


class Point(Base):
    __tablename__ = "point"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    body: Mapped[str]
    answer_id: Mapped[int] = mapped_column(ForeignKey("answer.id"))

    answer: Mapped[Answer] = relationship(back_populates="points")

    notes = relationship(
        "Note",
        primaryjoin=and_(id == foreign(Note.parent_id), Note.parent_type == "point"),
        backref="point",
    )
    positive: Mapped[bool]

    point_analysises: Mapped[list["PointAnalysis"]] = relationship(
        back_populates="point"
    )

    point_article_concepts: Mapped[list["PointArticleConcept"]] = relationship(
        back_populates="point"
    )
    fallback: Mapped["Fallback"] = relationship(back_populates="point")


# TODO: deprecate PointAnalysis
class PointAnalysis(Base):
    __tablename__ = "point_analysis"

    analysis_id: Mapped[int] = mapped_column(
        ForeignKey("analysis.id"), primary_key=True
    )
    point_id: Mapped[int] = mapped_column(ForeignKey("point.id"), primary_key=True)
    elaboration: Mapped[str]

    point: Mapped[Point] = relationship(back_populates="point_analysises")
    analysis: Mapped[Analysis] = relationship(backref="point_analysises")


class PointArticleConcept(Base):
    __tablename__ = "point_article_concept"

    article_id: Mapped[int]
    concept_id: Mapped[int]

    point_id: Mapped[int] = mapped_column(ForeignKey("point.id"), primary_key=True)
    elaboration: Mapped[str]

    point: Mapped[Point] = relationship(back_populates="point_article_concepts")
    article_concept: Mapped[ArticleConcept] = relationship(
        backref="point_article_concepts"
    )

    __table_args__ = (
        ForeignKeyConstraint(
            ["article_id", "concept_id"],
            ["article_concept.article_id", "article_concept.concept_id"],
        ),
    )


class Fallback(Base):
    __tablename__ = "fallback"

    id: Mapped[int] = mapped_column(primary_key=True)

    point_id: Mapped[int] = mapped_column(ForeignKey("point.id"))
    alt_approach: Mapped[str]
    general_argument: Mapped[str]

    point: Mapped[Point] = relationship(back_populates="fallback")
