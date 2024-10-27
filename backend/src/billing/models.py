from enum import Enum
from sqlalchemy import ARRAY, ForeignKey, String
from src.common.base import Base
from sqlalchemy.orm import Mapped, mapped_column


class StripePaymentInterval(str, Enum):
    MONTHLY = "month"
    ANNUAL = "year"


class StripeSession(Base):
    __tablename__ = "stripe_session"

    id: Mapped[str] = mapped_column(primary_key=True)
    # subscription ID will only be available after checkout completes,
    #   which happens after creating a session that we save in this table first
    subscription_id: Mapped[str | None] = mapped_column(nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    # TODO: Update this to be a foreign key to the tier table
    tier_id: Mapped[int]


class StripeProduct(Base):
    __tablename__ = "stripe_product"

    id: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str]
    description: Mapped[str]
    image_url: Mapped[str]
    is_active: Mapped[bool]
    features: Mapped[list[str]] = mapped_column(ARRAY(String))


class StripePrice(Base):
    __tablename__ = "stripe_price"

    id: Mapped[str] = mapped_column(primary_key=True)
    product_id: Mapped[str]
    description: Mapped[str]
    payment_interval: Mapped[StripePaymentInterval]
    # Price in cents
    price: Mapped[int]
    currency: Mapped[str]
    is_active: Mapped[bool]
