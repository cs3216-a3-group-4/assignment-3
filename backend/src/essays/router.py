from http import HTTPStatus
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session
from src.essays.models import (
    Comment,
    CommentAnalysis,
    Essay,
    Paragraph,
)
from src.lm.generate_essay_comments import (
    get_comments,
    get_essay_comments,
)

from src.essays.schemas import EssayCreate, EssayCreateDTO, EssayDTO, EssayMiniDTO
from sqlalchemy.orm import Session, selectinload
from src.events.models import Analysis
from src.likes.models import Like


router = APIRouter(prefix="/essays", tags=["essays"])


@router.post("/")
def create_essay(
    data: EssayCreate,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
) -> EssayCreateDTO:
    essay = Essay(question=data.question, user_id=user.id)

    paragraphs = []
    for index, paragraph in enumerate(data.paragraphs):
        # TODO: Categorise the paragraph?
        paragraph_orm = Paragraph(type=paragraph.type, content=paragraph.content)

        comments = get_comments(paragraph, data.question)
        paragraph_orm.comments = comments

        paragraphs.append(paragraph.content)
        essay.paragraphs.append(paragraph_orm)

    essay.comments = get_essay_comments(paragraphs, data.question)

    session.add(essay)
    session.commit()
    return {"essay_id": essay.id}


@router.get("/")
def get_essays(
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
) -> list[EssayMiniDTO]:
    essays = session.scalars(select(Essay).where(Essay.user_id == user.id))
    return essays


@router.get("/{id}")
def get_essay(
    id: int,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
) -> EssayDTO:
    essay = session.scalar(
        select(Essay)
        .where(Essay.id == id)
        .where(Essay.user_id == user.id)
        .options(
            selectinload(
                Essay.paragraphs,
                Paragraph.comments,
                Comment.comment_analysises,
                CommentAnalysis.analysis,
                Analysis.category,
            ),
            selectinload(
                Essay.paragraphs,
                Paragraph.comments,
                Comment.comment_analysises,
                CommentAnalysis.analysis,
                Analysis.likes.and_(Like.point_id.is_(None)).and_(
                    Like.user_id == user.id
                ),
            ),
            selectinload(
                Essay.comments,
                Comment.comment_analysises,
                CommentAnalysis.analysis,
                Analysis.category,
            ),
            selectinload(
                Essay.comments,
                Comment.comment_analysises,
                CommentAnalysis.analysis,
                Analysis.likes.and_(Like.point_id.is_(None)).and_(
                    Like.user_id == user.id
                ),
            ),
        )
    )
    if not essay:
        raise HTTPException(HTTPStatus.NOT_FOUND)

    return essay
