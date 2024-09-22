from http import HTTPStatus
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload, with_polymorphic
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session
from src.events.models import Event
from src.notes.models import Note
from src.user_questions.models import Answer, Point, UserQuestion
from src.user_questions.schemas import CreateUserQuestion, UserQuestionMiniDTO


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

    # TODO: rag magic or whatever [workflow 2]

    answer = Answer()
    user_question.answer = answer

    point = Point(title="placeholder", body="placeholder")

    # if this threw an error seed your db
    event = session.scalars(select(Event)).first()
    point.events.append(event)

    answer.points.append(point)

    session.add(user_question)
    session.commit()
    session.refresh(user_question)
    return user_question
