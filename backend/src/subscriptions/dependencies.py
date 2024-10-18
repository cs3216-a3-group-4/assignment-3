from http import HTTPStatus
from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from src.auth.dependencies import get_current_user
from src.common.dependencies import get_session
from src.subscriptions.models import Subscription


def retrieve_subscription(
    id: int,
    user=Depends(get_current_user),
    session=Depends(get_session),
) -> Subscription:
    subscription = session.scalar(
        select(Subscription)
        .where(Subscription.id == id)
        .options(
            selectinload(Subscription.user.and_(Subscription.user_id == user.id)),
        )
    )
    if not subscription:
        raise HTTPException(HTTPStatus.NOT_FOUND)

    return subscription
