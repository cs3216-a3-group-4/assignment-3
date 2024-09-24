from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.events.dependencies import retrieve_event
from src.events.models import Article, Category, Event, UserReadEvent
from src.common.dependencies import get_session
from src.events.schemas import EventDTO, EventIndexResponse
from src.notes.models import Note, NoteType
from src.notes.schemas import NoteDTO
from src.embeddings.vector_store import get_similar_results


router = APIRouter(prefix="/events", tags=["events"])


@router.get("/")
def get_events(
    user: Annotated[User, Depends(get_current_user)],
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
        .options(selectinload(Event.reads.and_(UserReadEvent.user_id == user.id)))
        .outerjoin(Event.reads.and_(UserReadEvent.user_id == user.id))
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


@router.post("/:id/read")
def read_event(
    id: int,
    user: Annotated[User, Depends(get_current_user)],
    _=Depends(retrieve_event),
    session=Depends(get_session),
):
    read_event = session.scalars(
        select(UserReadEvent)
        .where(UserReadEvent.event_id == id)
        .where(UserReadEvent.user_id == user.id)
    ).first()

    if read_event:
        read_event.last_read = datetime.now()
    else:
        date = datetime.now()
        read_event = UserReadEvent(
            event_id=id,
            user_id=user.id,
            first_read=date,
            last_read=date,
        )
    session.add(read_event)
    session.commit()
    return


@router.get("/search")
def search_whatever(query: str):
    # call your function and return the result
    results = get_similar_results(query)
    return results
