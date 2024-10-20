from enum import Enum
from sqlalchemy import ForeignKey
from src.auth.models import User
from src.common.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
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
    # Make user_id nullable since the frontend needs to match subscription.id
    #   to user.id for us, which might only happen after stripe webhook is triggered
    #   and this table is populated
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=True)
    price_id: Mapped[str]
    customer_id: Mapped[str]
    subscription_period_end: Mapped[datetime] = mapped_column(nullable=True)
    subscription_ended_date: Mapped[datetime] = mapped_column(nullable=True)
    subscription_cancel_at: Mapped[datetime] = mapped_column(nullable=True)
    subscription_cancelled_date: Mapped[datetime] = mapped_column(nullable=True)
    status: Mapped[SubscriptionStatusType]

    # Nullable for the same reason as user_id above
    user: Mapped[User] = relationship(
        "User", back_populates="subscription", foreign_keys=[user_id], nullable=True
    )