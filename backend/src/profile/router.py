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
    categories = session.scalars(
        select(Category).where(Category.id.in_(data.category_ids))
    ).all()

    user = session.get(User, user.id)
    user.categories = categories

    session.add(user)
    session.commit()
    session.refresh(user)

    return user
