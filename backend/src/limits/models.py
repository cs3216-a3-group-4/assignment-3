from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey
from enum import Enum
from src.common.base import Base


class TierNames(str, Enum):
    FREE = "FREE"
    ADMIN = "ADMIN"
    PREMIUM = "PREMIUM"


class Usage(Base):
    __tablename__ = "usage"

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), primary_key=True)
    gp_question_asked: Mapped[int]


class Tier(Base):
    __tablename__ = "tier"

    id: Mapped[int] = mapped_column(primary_key=True)
    tier_name: Mapped[TierNames]
    label: Mapped[str]
    gp_question_limit: Mapped[int]
