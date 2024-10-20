from sqlalchemy import ForeignKey
from src.common.base import Base
from sqlalchemy.orm import Mapped, mapped_column


class StripeSession(Base):
    __tablename__ = "stripe_session"

    id: Mapped[str] = mapped_column(primary_key=True)
    subscription_id: Mapped[str] = mapped_column(ForeignKey("subscription.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    # TODO: Update this to be a foreign key to the tier table
    tier_id: Mapped[int]
