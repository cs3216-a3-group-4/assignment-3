from enum import Enum
from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.common.base import Base
from src.events.models import Category


class AccountType(str, Enum):
    NORMAL = "normal"
    GOOGLE = "google"


user_category_table = Table(
    "user_category",
    Base.metadata,
    Column("user_id", ForeignKey("user.id")),
    Column("category_id", ForeignKey("category.id")),
)


class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str]
    hashed_password: Mapped[str]
    account_type: Mapped[AccountType]

    categories: Mapped[list[Category]] = relationship(secondary=user_category_table)
