from enum import Enum
from sqlalchemy import ForeignKey
from src.common.base import Base
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime


class SubscriptionStatusType(str, Enum):
    ACTIVE = "active"
    CANCELLED = "cancelled"
    PAUSED = "paused"
    PAST_DUE = "past_due"
    UNPAID = "unpaid"


class Subscription(Base):
    __tablename__ = "subscription"

    id: Mapped[str] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", name="fk_subscription_user_id"), nullable=True
    )
    price_id: Mapped[str]
    customer_id: Mapped[str]
    subscription_period_end: Mapped[datetime] = mapped_column(nullable=True)
    subscription_ended_date: Mapped[datetime] = mapped_column(nullable=True)
    subscription_cancel_at: Mapped[datetime] = mapped_column(nullable=True)
    subscription_cancelled_date: Mapped[datetime] = mapped_column(nullable=True)
    status: Mapped[SubscriptionStatusType]
