from http import HTTPStatus
from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from src.auth.dependencies import get_current_user
from src.common.dependencies import get_session
from src.events.models import (
    Analysis,
    ArticleConcept,
    Bookmark,
    Event,
    GPQuestion,
    UserReadEvent,
)
from src.likes.models import Like
from src.notes.models import Note
from src.user_questions.models import Point  # noqa: F401


def retrieve_event(
    id: int,
    user=Depends(get_current_user),
    session=Depends(get_session),
) -> Event:
    event = session.scalar(
        select(Event)
        .where(Event.id == id)
        .options(
            selectinload(Event.reads.and_(UserReadEvent.user_id == user.id)),
            selectinload(Event.gp_questions).selectinload(
                GPQuestion.categories,
            ),
            selectinload(
                Event.categories,
            ),
            selectinload(Event.analysises),
            selectinload(Event.analysises).selectinload(Analysis.category),
            selectinload(Event.analysises).selectinload(
                Analysis.notes.and_(Note.user_id == user.id)
            ),
            selectinload(Event.notes.and_(Note.user_id == user.id)),
            selectinload(Event.analysises).selectinload(
                Analysis.likes.and_(Like.point_id.is_(None))
            ),
            selectinload(Event.original_article),
            selectinload(Event.bookmarks.and_(Bookmark.user_id == user.id)),
        )
    )
    if not event:
        raise HTTPException(HTTPStatus.NOT_FOUND)

    return event
