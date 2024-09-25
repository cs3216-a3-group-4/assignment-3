from http import HTTPStatus
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session
from src.events.models import Analysis
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
    # 1. check if the analysis or point exists
    analysis = session.get(Analysis, data.analysis_id)
    if not analysis:
        raise HTTPException(HTTPStatus.NOT_FOUND, "analysis doesn't exist")

    query = select(Like).where(Like.analysis_id == data.analysis_id)

    if data.point_id:
        point = session.get(Point, data.point_id)
        if not point:
            raise HTTPException(HTTPStatus.NOT_FOUND, "point doesn't exist")
        query = query.where(Like.point_id == data.point_id)
    else:
        query = query.where(Like.point_id.is_(None))

    query = query.where(Like.user_id == user.id)

    # 2. check if the like exists
    like = session.scalar(query)

    # 3. create or update
    if not like:
        like = Like(
            point_id=data.point_id, analysis_id=data.analysis_id, user_id=user.id
        )
    like.type = data.type
    session.add(like)
    session.commit()
