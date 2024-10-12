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
    CommentParentType,
    Essay,
    Inclination,
    Paragraph,
    ParagraphType,
)
from src.lm.generate_essay_comments import get_comments

from src.essays.schemas import EssayCreate, EssayDTO, EssayMiniDTO
from sqlalchemy.orm import Session, selectinload
from src.events.models import Analysis
from src.likes.models import Like


router = APIRouter(prefix="/essays", tags=["essays"])


@router.post("/")
def create_essay(
    data: EssayCreate,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    essay = Essay(question=data.question, user_id=user.id)

    paragraph = []
    for index, paragraph in enumerate(data.paragraphs):
        # TODO: Categorise the paragraph?
        paragraph_orm = Paragraph(type=ParagraphType.PARAGRAPH, content=paragraph)

        # comment_with_example = Comment(
        #     inclination=Inclination.NEUTRAL,
        #     content=f"comment for paragraph {index} with example",
        #     parent_type=CommentParentType.PARAGRAPH,
        # )
        # comment_with_example.comment_analysises.append(
        #     CommentAnalysis(skill_issue="get good", analysis_id=1)
        # )

        # # TODO: Add comments for each paragraph
        # paragraph_orm.comments = [
        #     Comment(
        #         inclination=Inclination.NEUTRAL,
        #         content=f"comment for paragraph {index}",
        #         parent_type=CommentParentType.PARAGRAPH,
        #     ),
        #     comment_with_example,
        # ]

        comments = get_comments(paragraph, data.question)
        paragraph_orm.comments = comments

        essay.paragraphs.append(paragraph_orm)

    # TODO: Add general comments for essay
    essay.comments = [
        Comment(
            inclination=Inclination.GOOD,
            content="placeholder",
            parent_type=CommentParentType.ESSAY,
        )
    ]

    session.add(essay)
    session.commit()


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
