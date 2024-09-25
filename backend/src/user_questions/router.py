from http import HTTPStatus
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload, with_polymorphic
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session
from src.events.models import Analysis, Event
from src.notes.models import Note
from src.user_questions.models import Answer, Point, UserQuestion
from src.user_questions.schemas import CreateUserQuestion, UserQuestionMiniDTO
from src.lm.generate_points import get_relevant_analyses


router = APIRouter(prefix="/user-questions", tags=["user-questions"])

polymorphic_note = with_polymorphic(Note, "*")


@router.get("/")
def get_user_questions(
    user: Annotated[User, Depends(get_current_user)],
    session=Depends(get_session),
) -> list[UserQuestionMiniDTO]:
    user_questions = session.scalars(
        select(UserQuestion)
        .where(UserQuestion.user_id == user.id)
        .options(
            selectinload(
                UserQuestion.answer, Answer.points, Point.events, Event.categories
            ),
        )
    )
    return user_questions


@router.get("/:id")
def get_user_question(
    id: int,
    user: Annotated[User, Depends(get_current_user)],
    session=Depends(get_session),
):
    user_question = (
        session.execute(
            select(UserQuestion.id == id)
            .where(UserQuestion.user_id == user.id)
            .where(UserQuestion.id)
            .options(
                selectinload(UserQuestion.answer)
                .selectinload(Answer.points)
                .selectinload(Point.events)
                .selectinload(Event.categories),
                selectinload(UserQuestion.answer)
                .selectinload(Answer.points)
                .selectinload(Point.notes),
            )
        )
        .scalars()
        .first()
    )

    if not user_question:
        raise HTTPException(HTTPStatus.NOT_FOUND)

    # TODO: support notes in schema
    return user_question


@router.post("/")
def create_user_question(
    data: CreateUserQuestion,
    user: Annotated[User, Depends(get_current_user)],
    session=Depends(get_session),
) -> UserQuestionMiniDTO:
    user_question = UserQuestion(question=data.question, user_id=user.id)

    answer = Answer()
    user_question.answer = answer

    results = get_relevant_analyses(data.question)
    for row in results["for_points"] + results["against_points"]:
        point = row["point"]
        analyses = row["analyses"]
        point = Point(title="point", body="")
        analysis_id = [analysis["id"] for analysis in analyses]

        point.analysises = list(
            session.scalars(select(Analysis).where(Analysis.id.in_(analysis_id)))
        )
        answer.points.append(point)

    session.add(user_question)
    session.commit()
    session.refresh(user_question)
    same_user_question = session.scalar(
        select(UserQuestion)
        .where(UserQuestion.id == user_question.id)
        .join(UserQuestion.answer)
        .join(Answer.points)
        .join(Point.analysises)
        .join(Analysis.event)
        .join(Event.original_article)
        .join(Analysis.category)
        # .options(
        #     selectinload(
        #         UserQuestion.answer, Answer.points, Point.analysises, Analysis.event, Event.ca
        #     ),
        #     selectinload(
        #         UserQuestion.answer, Answer.points, Point.analysises, Analysis.category
        #     ),
        # )
    )
    return same_user_question


@router.get("/ask-gp-question")
def ask_gp_question(question: str):
    return get_relevant_analyses(question)
