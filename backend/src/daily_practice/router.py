from http import HTTPStatus
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.daily_practice.models import (
    DailyPractice,
    DailyPracticeAttempt,
    DailyPracticeAttemptPoint,
)
from src.common.dependencies import get_session
from src.daily_practice.schemas import (
    CreateDailyPracticeAttemptDTO,
    DailyPracticeAttemptBaseDTO,
    DailyPracticeAttemptDTO,
    DailyPracticeDTO,
)
from src.essays.models import Comment, CommentParentType
from src.events.models import Article, ArticleBookmark
from src.lm.generate_daily_practice_comments import generate_practice_comments


router = APIRouter(prefix="/daily-practices", tags=["daily-practices"])


@router.get("/")
def get_all_daily_practices(
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
) -> list[DailyPracticeDTO]:
    daily_practices = session.scalars(
        select(DailyPractice)
        .order_by(DailyPractice.date.desc())
        .options(
            selectinload(DailyPractice.article).selectinload(Article.categories),
            selectinload(DailyPractice.article).selectinload(
                Article.bookmarks.and_(ArticleBookmark.user_id == user.id)
            ),
            selectinload(
                DailyPractice.attempts.and_(DailyPracticeAttempt.user_id == user.id)
            ),
        )
    )
    return daily_practices


@router.get("/today")
def get_todays_practice(
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
) -> DailyPracticeDTO:
    daily_practice = session.scalar(
        select(DailyPractice)
        .order_by(DailyPractice.date.desc())
        .limit(1)
        .options(
            selectinload(DailyPractice.article),
            selectinload(
                DailyPractice.attempts.and_(DailyPracticeAttempt.user_id == user.id)
            ),
        )
    )
    return daily_practice


@router.get("/{id}")
def get_day_practice(
    id: int,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
) -> DailyPracticeDTO:
    daily_practice = session.scalar(
        select(DailyPractice)
        .where(DailyPractice.id == id)
        .options(
            selectinload(DailyPractice.article),
            selectinload(
                DailyPractice.attempts.and_(DailyPracticeAttempt.user_id == user.id)
            ).selectinload(DailyPracticeAttempt.points),
            selectinload(
                DailyPractice.attempts.and_(DailyPracticeAttempt.user_id == user.id)
            ).selectinload(DailyPracticeAttempt.comments),
        )
    )
    return daily_practice


@router.post("/{id}/attempts")
def create_daily_practice_attempt(
    id: int,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
    data: CreateDailyPracticeAttemptDTO,
) -> int:
    daily_practice = session.scalar(select(DailyPractice).where(DailyPractice.id == id))

    if not daily_practice:
        raise HTTPException(HTTPStatus.NOT_FOUND)

    new_attempt = DailyPracticeAttempt(user_id=user.id)
    new_attempt.points = [
        DailyPracticeAttemptPoint(content=point) for point in data.points
    ]

    for _ in range(5):
        try:
            comments_llm = generate_practice_comments(data.points)
            break
        except Exception as e:  # noqa: E722
            print(e)
    else:
        # should be 500 tbh
        raise HTTPException(HTTPStatus.BAD_REQUEST)

    new_attempt.comments = [
        Comment(
            inclination=comment["inclination"],
            content=comment["comment"],
            lack_example=False,
            parent_type=CommentParentType.DAILY_PRACTICE_ATTEMPT,
        )
        for comment in comments_llm["comments"]
    ]
    daily_practice.attempts.append(new_attempt)

    session.commit()
    session.refresh(new_attempt)
    return new_attempt.id


@router.get("/attempts")
def get_all_attempts(
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
) -> list[DailyPracticeAttemptBaseDTO]:
    attempts = session.scalars(
        select(DailyPracticeAttempt)
        .where(DailyPracticeAttempt.user_id == user.id)
        .order_by(DailyPracticeAttempt.id.desc())
        .options(
            selectinload(DailyPracticeAttempt.daily_practice).selectinload(
                DailyPractice.article
            )
        )
    )
    return attempts


@router.get("/attempts/{id}")
def get_attempt(
    id: int,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
) -> list[DailyPracticeAttemptDTO]:
    attempts = session.scalars(
        select(DailyPracticeAttempt)
        .where(DailyPracticeAttempt.user_id == user.id)
        .where(DailyPracticeAttempt.id == id)
        .order_by(DailyPracticeAttempt.id.desc())
        .options(
            selectinload(DailyPracticeAttempt.daily_practice).selectinload(
                DailyPractice.article
            ),
            selectinload(DailyPracticeAttempt.comments),
            selectinload(DailyPracticeAttempt.points),
        )
    )
    return attempts
