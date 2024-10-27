from http import HTTPStatus
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session
from src.essays.models import Comment
from src.events.models import Analysis, ArticleConcept
from src.likes.models import Like
from src.likes.schemas import LikeData
from src.user_questions.models import Point


router = APIRouter(prefix="/likes", tags=["likes"])


@router.post("/")
def upsert_like(
    data: LikeData,
    user: Annotated[User, Depends(get_current_user)],
    session=Depends(get_session),
):
    # assumes that for each like row, only 1 of concept_id, analysis_id, or point_id is populated
    # the implementation is less than ideal and should be refactored (but we probably never will)
    query = select(Like).where(Like.user_id == user.id)  # only retrieve user's likes
    if data.concept_id:
        concept = session.get(ArticleConcept, (data.concept_id, data.article_id))
        if not concept:
            raise HTTPException(HTTPStatus.NOT_FOUND, "article concept doesn't exist")
        query = query.where(Like.concept_id == data.concept_id)
    elif data.analysis_id:
        analysis = session.get(Analysis, data.analysis_id)
        if not analysis:
            raise HTTPException(HTTPStatus.NOT_FOUND, "analysis doesn't exist")
        query = query.where(Like.analysis_id == data.analysis_id)
    elif data.point_id:
        point = session.get(Point, data.point_id)
        if not point:
            raise HTTPException(HTTPStatus.NOT_FOUND, "point doesn't exist")
        query = query.where(Like.point_id == data.point_id)
    elif data.comment_id:
        comment = session.get(Comment, data.comment_id)
        if not comment:
            raise HTTPException(HTTPStatus.NOT_FOUND, "comment doesn't exist")
        query = query.where(Like.comment_id == data.comment_id)
    else:
        raise HTTPException(HTTPStatus.NOT_FOUND, "like entity doesn't exist")

    # 2. check if the like exists
    like = session.scalar(query)

    # 3. create or update
    if not like:
        like = Like(
            point_id=data.point_id,
            article_id=data.article_id,
            concept_id=data.concept_id,
            analysis_id=data.analysis_id,
            comment_id=data.comment_id,
            user_id=user.id,
        )
    like.type = data.type
    session.add(like)
    session.commit()
