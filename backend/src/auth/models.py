from datetime import datetime
from enum import Enum
from sqlalchemy import Column, DateTime, ForeignKey, Integer, Table, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.common.base import Base
from src.events.models import Bookmark, Category
from src.limits.models import Tier, Usage
from src.notes.models import Note
from src.subscriptions.models import Subscription  # noqa: F401


class AccountType(str, Enum):
    NORMAL = "normal"
    GOOGLE = "google"


user_category_table = Table(
    "user_category",
    Base.metadata,
    Column("user_id", ForeignKey("user.id")),
    Column("category_id", ForeignKey("category.id")),
)


class Role(str, Enum):
    NORMAL = "normal"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True)
    hashed_password: Mapped[str]
    account_type: Mapped[AccountType]
    last_accessed: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    role: Mapped[Role] = mapped_column(server_default="NORMAL")

    categories: Mapped[list[Category]] = relationship(secondary=user_category_table)
    notes: Mapped[list[Note]] = relationship("Note", backref="user")
    top_events_period: Mapped[int] = mapped_column(Integer, default=7)

    bookmarks: Mapped[list[Bookmark]] = relationship(backref="user")

    tier_id: Mapped[int] = mapped_column(
        ForeignKey("tier.id"), default=1, server_default="1"
    )
    subscription: Mapped[Subscription] = relationship(
        "Subscription", backref="user", lazy="selectin", uselist=False
    )

    tier: Mapped[Tier] = relationship("Tier", backref="user")
    usage: Mapped[Usage] = relationship("Usage", backref="user")


class PasswordReset(Base):
    __tablename__ = "password-reset"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    code: Mapped[str]
    used: Mapped[bool]
