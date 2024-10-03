from http import HTTPStatus
from pprint import pprint
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import with_polymorphic, selectinload
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session
from src.events.models import Analysis, Event
from src.notes.models import Note
from src.user_questions.models import (
    Answer,
    Fallback,
    Point,
    PointAnalysis,
    UserQuestion,
)
from src.user_questions.schemas import (
    CreateUserQuestion,
    UserQuestionDTO,
    UserQuestionMiniDTO,
    ValidationResult,
)
from src.lm.generate_response import generate_response
from src.lm.generate_points import get_relevant_analyses
from src.lm.validate_question import validate_question


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
        .options(selectinload(UserQuestion.answer).selectinload(Answer.points))
    )
    return user_questions


@router.get("/ask-gp-question")
async def ask_gp_question(question: str):
    return await generate_response(question)


@router.get("/gen-points")
def gen_points(question: str):
    return get_relevant_analyses(question)


@router.get("/{id}")
def get_user_question(
    id: int,
    user: Annotated[User, Depends(get_current_user)],
    session=Depends(get_session),
) -> UserQuestionDTO:
    user_question = session.scalar(
        select(UserQuestion)
        .where(UserQuestion.id == id)
        .where(UserQuestion.user_id == user.id)
        .options(
            selectinload(
                UserQuestion.answer,
                Answer.points,
                Point.point_analysises,
                PointAnalysis.analysis,
                Analysis.event,
                Event.original_article,
            ),
            selectinload(
                UserQuestion.answer,
                Answer.points,
                Point.fallback,
            ),
            selectinload(
                UserQuestion.answer,
                Answer.points,
                Point.point_analysises,
                PointAnalysis.analysis,
                Analysis.category,
            ),
        )
    )
    if not user_question:
        raise HTTPException(HTTPStatus.NOT_FOUND)

    return user_question


@router.post("/classify")
def classify_question(question: str):
    return validate_question(question)


@router.post("/")
async def create_user_question(
    data: CreateUserQuestion,
    user: Annotated[User, Depends(get_current_user)],
    session=Depends(get_session),
) -> UserQuestionDTO | ValidationResult:
    validation = validate_question(data.question)
    if not validation["is_valid"]:
        return validation

    user_question = UserQuestion(question=data.question, user_id=user.id)

    answer = Answer()
    user_question.answer = answer

    results = await generate_response(data.question)

    pprint(results)

    for row in results["for_points"]:
        point = row["point"]
        analyses = row["analyses"]
        point = Point(title=point, body="", positive=True)

        for analysis in analyses:
            point.point_analysises.append(
                PointAnalysis(
                    elaboration=analysis["elaborations"],
                    analysis_id=analysis["id"],
                )
            )
        if not analyses:
            point.fallback = Fallback(
                alt_approach=row["fall_back_response"]["alt_approach"],
                general_argument=row["fall_back_response"]["general_argument"],
            )
        answer.points.append(point)

    for row in results["against_points"]:
        point = row["point"]
        analyses = row["analyses"]
        point = Point(title=point, body="", positive=False)
        for analysis in analyses:
            point.point_analysises.append(
                PointAnalysis(
                    elaboration=analysis["elaborations"],
                    analysis_id=analysis["id"],
                )
            )
        if not analyses:
            point.fallback = Fallback(
                alt_approach=row["fall_back_response"]["alt_approach"],
                general_argument=row["fall_back_response"]["general_argument"],
            )
        answer.points.append(point)

    session.add(user_question)
    session.commit()
    session.refresh(user_question)
    same_user_question = session.scalar(
        select(UserQuestion)
        .where(UserQuestion.id == user_question.id)
        .options(
            selectinload(
                UserQuestion.answer,
                Answer.points,
                Point.point_analysises,
                PointAnalysis.analysis,
                Analysis.event,
                Event.original_article,
            ),
            selectinload(
                UserQuestion.answer,
                Answer.points,
                Point.fallback,
            ),
            selectinload(
                UserQuestion.answer,
                Answer.points,
                Point.point_analysises,
                PointAnalysis.analysis,
                Analysis.category,
            ),
        )
    )

    return same_user_question
