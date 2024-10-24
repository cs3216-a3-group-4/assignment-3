from sqlalchemy import ForeignKey
from src.common.base import Base
from sqlalchemy.orm import Mapped, mapped_column


class StripeSession(Base):
    __tablename__ = "stripe_session"

    id: Mapped[str] = mapped_column(primary_key=True)
    # subscription ID will only be available after checkout completes, 
    #   which happens after creating a session that we save in this table first
    subscription_id: Mapped[str | None] = mapped_column(nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    # TODO: Update this to be a foreign key to the tier table
    tier_id: Mapped[int]
