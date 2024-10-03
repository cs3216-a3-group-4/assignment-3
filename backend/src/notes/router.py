from http import HTTPStatus
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session
from src.events.models import Analysis, Article, Category, Event
from src.notes.dependencies import retrieve_note
from src.notes.models import Note, NoteType
from src.notes.schemas import NoteCreate, NoteDTO, NoteUpdate
from src.user_questions.models import Point


router = APIRouter(prefix="/notes", tags=["notes"])

NOTE_PARENT_CLASSES = {
    NoteType.ARTICLE: Article,
    NoteType.EVENT: Event,
    NoteType.POINT: Point,
    NoteType.ANALYSIS: Analysis,
}


@router.get("/")
def get_all_notes(
    user: Annotated[User, Depends(get_current_user)], session=Depends(get_session)
) -> list[NoteDTO]:
    notes = session.scalars(
        select(Note).where(Note.user_id == user.id).options(selectinload(Note.category))
    )
    return notes


@router.post("/")
def create_note(
    data: NoteCreate,
    user: Annotated[User, Depends(get_current_user)],
    session=Depends(get_session),
) -> NoteDTO:
    parent_class = NOTE_PARENT_CLASSES[data.parent_type]
    parent_model = session.get(parent_class, data.parent_id)
    if not parent_model:
        raise HTTPException(HTTPStatus.NOT_FOUND)

    category = session.get(Category, data.category_id)
    if not category:
        raise HTTPException(HTTPStatus.NOT_FOUND)

    # TODO: test if this works
    if (
        data.parent_type == NoteType.POINT
        and parent_model.answer.user_question.user_id != user.id
    ):
        raise HTTPException(HTTPStatus.NOT_FOUND)

    new_note = Note(**data.model_dump(), user_id=user.id)
    session.add(new_note)
    session.commit()
    session.refresh(new_note)

    return new_note


@router.put("/{id}")
def update_note(
    data: NoteUpdate,
    note: Note = Depends(retrieve_note),
    session=Depends(get_session),
) -> NoteDTO:
    category = session.get(Category, data.category_id)
    if not category:
        raise HTTPException(HTTPStatus.NOT_FOUND)

    note.content = data.content
    note.start_index = data.start_index
    note.end_index = data.end_index
    note.category_id = data.category_id
    session.add(note)
    session.commit()
    session.refresh(note)
    return note


@router.delete("/{id}")
def delete_note(
    note=Depends(retrieve_note),
    session=Depends(get_session),
):
    session.delete(note)
    session.commit()


points_router = APIRouter(prefix="/points", tags=["points"])


@points_router.get("/{id}/notes")
def get_point_notes(
    user: Annotated[User, Depends(get_current_user)],
    session=Depends(get_session),
):
    # TODO: validate point
    notes = session.scalars(
        select(Note)
        .where(Note.parent_id == id)
        .where(Note.parent_type == NoteType.POINT)
        .where(Note.user_id == user.id)
    )
    return notes
