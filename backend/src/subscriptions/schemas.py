from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from src.subscriptions.models import SubscriptionStatusType


class SubscriptionDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    user_id: int
    price_id: str
    customer_id: str
    subscription_period_end: Optional[datetime] = None
    subscription_ended_date: Optional[datetime] = None
    subscription_cancel_at: Optional[datetime] = None
    subscription_cancelled_date: Optional[datetime] = None
    status: SubscriptionStatusType
