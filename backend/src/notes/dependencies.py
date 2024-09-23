from http import HTTPStatus
from typing import Annotated
from fastapi import Depends, HTTPException
from sqlalchemy import select
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session
from src.notes.models import Note


def retrieve_note(
    id: int,
    user: Annotated[User, Depends(get_current_user)],
    session=Depends(get_session),
) -> Note:
    note = session.scalars(
        select(Note).where(Note.id == id and Note.user_id == user.id)
    ).first()
    if not note:
        raise HTTPException(HTTPStatus.NOT_FOUND)
    return note
