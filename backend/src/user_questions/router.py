from http import HTTPStatus
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import with_polymorphic, selectinload, Session
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session
from src.embeddings.store_concepts import get_similar_concepts
from src.essay_helper.generate_concept_response import (
    generate_concept_response,
    generate_elaborations_for_point,
)
from src.events.models import Analysis, ArticleConcept, Event
from src.lm.society_classifier import classify_society_qn
from src.notes.models import Note
from src.limits.check_usage import within_usage_limit
from src.user_questions.models import (
    Answer,
    Point,
    PointAnalysis,
    PointArticleConcept,
    UserQuestion,
)
from src.essay_helper.form_answer import (
    form_answer_concept_based,
    form_point_concept_based,
)
from src.user_questions.schemas import (
    CreateUserQuestion,
    PointCreateDTO,
    UserQuestionConceptDTO,
    UserQuestionDTO,
    UserQuestionMiniDTO,
    ValidationResult,
)
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


@router.get("/{id}")
def get_user_question(
    id: int,
    user: Annotated[User, Depends(get_current_user)],
    session=Depends(get_session),
) -> UserQuestionConceptDTO | UserQuestionDTO:
    user_question = session.scalar(
        select(UserQuestion)
        .where(UserQuestion.id == id)
        .where(UserQuestion.user_id == user.id)
        .options(
            selectinload(UserQuestion.answer)
            .selectinload(Answer.points)
            .selectinload(Point.point_analysises)
            .selectinload(PointAnalysis.analysis)
            .selectinload(Analysis.event)
            .selectinload(Event.original_article),
            selectinload(UserQuestion.answer)
            .selectinload(Answer.points)
            .selectinload(Point.fallback),
            selectinload(UserQuestion.answer)
            .selectinload(Answer.points)
            .selectinload(Point.point_analysises)
            .selectinload(PointAnalysis.analysis)
            .selectinload(Analysis.category),
            selectinload(UserQuestion.answer)
            .selectinload(Answer.points)
            .selectinload(Point.likes),
            selectinload(UserQuestion.answer)
            .selectinload(Answer.points)
            .selectinload(Point.point_analysises)
            .selectinload(PointAnalysis.analysis)
            .selectinload(Analysis.likes),
            selectinload(
                UserQuestion.answer,
                Answer.points,
                Point.point_article_concepts,
                PointArticleConcept.article_concept,
                ArticleConcept.article,
            ),
            selectinload(
                UserQuestion.answer,
                Answer.points,
                Point.point_article_concepts,
                PointArticleConcept.article_concept,
                ArticleConcept.concept,
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
async def create_concept_based_user_qn(
    data: CreateUserQuestion,
    user: Annotated[User, Depends(get_current_user)],
    session=Depends(get_session),
) -> UserQuestionConceptDTO | ValidationResult:
    validation = within_usage_limit(user, session, data.question)

    if not validation.is_valid:
        return validation

    user_question = UserQuestion(question=data.question, user_id=user.id)

    results = await generate_concept_response(data.question)
    answer = form_answer_concept_based(results)

    user_question.answer = answer

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
                Point.point_article_concepts,
                PointArticleConcept.article_concept,
                ArticleConcept.article,
            ),
            selectinload(
                UserQuestion.answer,
                Answer.points,
                Point.point_article_concepts,
                PointArticleConcept.article_concept,
                ArticleConcept.concept,
            ),
            selectinload(
                UserQuestion.answer,
                Answer.points,
                Point.fallback,
            ),
        )
    )

    return same_user_question


@router.post("/{id}/points")
async def create_point(
    id: int,
    data: PointCreateDTO,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    user_question = session.scalar(
        select(UserQuestion)
        .where(UserQuestion.id == id)
        .where(UserQuestion.user_id == user.id)
        .options(selectinload(UserQuestion.answer).selectinload(Answer.points))
    )

    if not user_question:
        return HTTPException(HTTPStatus.NOT_FOUND)

    point = data.title

    # TODO: refactor this to be stored on qn creation so we aren't calling this for every new point
    is_society_question = classify_society_qn(user_question.question)

    point_dict = {
        "point": point,
        "concepts": await get_similar_concepts(point, 5, filter_sg=is_society_question),
    }
    await generate_elaborations_for_point(point_dict, user_question.question)
    point_orm = form_point_concept_based(point_dict, data.positive)
    point_orm.generated = False

    user_question.answer.points.append(point_orm)
    session.add(user_question)
    session.commit()

    return
