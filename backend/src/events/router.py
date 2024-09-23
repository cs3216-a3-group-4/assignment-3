from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.events.dependencies import retrieve_event
from src.events.models import Article, Category, Event
from src.common.dependencies import get_session
from src.events.schemas import EventDTO, EventIndexResponse
from src.notes.models import Note, NoteType
from src.notes.schemas import NoteDTO


router = APIRouter(prefix="/events", tags=["events"])


@router.get("/")
def get_events(
    _: Annotated[User, Depends(get_current_user)],
    start_date: Annotated[datetime | None, Query()] = None,
    end_date: Annotated[datetime | None, Query()] = None,
    session=Depends(get_session),
    category_ids: Annotated[list[int] | None, Query()] = None,
    limit: int | None = None,
    offset: int | None = None,
) -> EventIndexResponse:
    query = select(Event.id).distinct()
    if category_ids:
        query = query.join(Event.categories.and_(Category.id.in_(category_ids)))
    relevant_ids = [id for id in session.scalars(query)]

    total_count = len(relevant_ids)
    event_query = (
        select(Event)
        .options(selectinload(Event.categories))
        .options(selectinload(Event.original_article))
        .where(Event.id.in_(relevant_ids))
    )
    if limit is not None:
        event_query = event_query.limit(limit)
    if offset is not None:
        event_query = event_query.offset(offset)
    if start_date is not None:
        event_query = event_query.where(
            Event.original_article.has(Article.date >= start_date)
        )
    if end_date is not None:
        event_query = event_query.where(
            Event.original_article.has(Article.date <= end_date)
        )
    event_query = event_query.order_by(Event.rating.desc(), Event.date.desc())

    events = list(session.scalars(event_query))
    return EventIndexResponse(total_count=total_count, count=len(events), data=events)


@router.get("/:id")
def get_event(
    _: Annotated[User, Depends(get_current_user)],
    event=Depends(retrieve_event),
) -> EventDTO:
    return event


@router.get("/:id/notes")
def get_event_notes(
    id: int,
    user: Annotated[User, Depends(get_current_user)],
    _=Depends(retrieve_event),
    session=Depends(get_session),
) -> list[NoteDTO]:
    notes = session.scalars(
        select(Note)
        .where(Note.parent_id == id)
        .where(Note.parent_type == NoteType.EVENT)
        .where(Note.user_id == user.id)
    )
    return notes
