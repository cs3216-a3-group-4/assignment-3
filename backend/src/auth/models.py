from enum import Enum
from sqlalchemy.orm import Mapped, mapped_column
from src.common.base import Base


class AccountType(str, Enum):
    normal = "normal"
    google = "google"


class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str]
    hashed_password: Mapped[str]
    account_type: Mapped[AccountType]
