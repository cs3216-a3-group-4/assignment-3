from http import HTTPStatus
from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from src.common.dependencies import get_session
from src.events.models import Analysis, Event, GPQuestion


def retrieve_event(
    id: int,
    session=Depends(get_session),
):
    event = session.scalar(
        select(Event)
        .where(Event.id == id)
        .options(
            selectinload(
                Event.gp_questions,
                GPQuestion.categories,
            ),
            selectinload(
                Event.categories,
            ),
            selectinload(Event.analysises, Analysis.category),
        )
    )
    if not event:
        raise HTTPException(HTTPStatus.NOT_FOUND)

    return event
