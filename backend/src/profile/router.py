from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy import select
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.auth.schemas import UserPublic
from src.events.models import Category
from src.common.dependencies import get_session
from src.profile.schemas import ProfileUpdate


router = APIRouter(prefix="/profile", tags=["profile"])


@router.put("/")
def update_profile(
    data: ProfileUpdate,
    user: Annotated[User, Depends(get_current_user)],
    session=Depends(get_session),
) -> UserPublic:
    user = session.get(User, user.id)

    if data.category_ids:
        categories = session.scalars(
            select(Category).where(Category.id.in_(data.category_ids))
        ).all()
        user.categories = categories
    if data.top_events_period:
        user.top_events_period = data.top_events_period

    if data.category_ids or data.top_events_period:
        session.add(user)
        session.commit()
        session.refresh(user)

    return user
