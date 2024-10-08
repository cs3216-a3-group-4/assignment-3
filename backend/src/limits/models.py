from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Enum
from src.common.base import Base


class Usage(Base):
    __tablename__ = "usage"

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), primary_key=True)
    gp_question_asked: Mapped[int]

    user = relationship("User", backref="usage")


class Tier(Base):
    __tablename__ = "tier"

    id: Mapped[int] = mapped_column(primary_key=True)
    tier_name: Mapped[str] = Enum("TierName", ["FREE", "ADMIN", "PREMIUM"])
    label: Mapped[str]
    gp_question_limit: Mapped[int]
