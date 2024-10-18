from typing import Annotated
from fastapi import APIRouter, Depends

from sqlalchemy import select
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session
from src.subscriptions.dependencies import retrieve_subscription
from src.subscriptions.models import Subscription, SubscriptionStatusType
from src.subscriptions.schemas import SubscriptionDTO


router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])

@router.get("/{id}")
def get_subscription(
    _: Annotated[User, Depends(get_current_user)],
    subscription = Depends(retrieve_subscription),
) -> SubscriptionDTO:
    
    return subscription

@router.get("/{id}/status")
def get_subscription_status(
    id: int,
    user: Annotated[User, Depends(get_current_user)],
    _ = Depends(retrieve_subscription),
    session = Depends(get_session),
) -> SubscriptionStatusType:
    subscription = session.scalar(
        select(Subscription.status)
        .where(Subscription.id == id)
        .where(Subscription.user_id == user.id)
    )
    return subscription
