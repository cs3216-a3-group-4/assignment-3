from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator
from src.categories.schemas import CategoryDTO
from src.limits.schemas import TierDTO, UsageDTO
from src.subscriptions.schemas import SubscriptionDTO


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    last_accessed: datetime
    image_url: str | None = None

    categories: list[CategoryDTO]
    top_events_period: int = 7
    tier_id: int = 1
    subscription: Optional[SubscriptionDTO] = None

    usage: UsageDTO | None = None
    tier: TierDTO
    verified: bool


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserPublic


class SignUpData(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class PasswordResetRequestData(BaseModel):
    email: EmailStr


class PasswordResetCompleteData(BaseModel):
    password: str = Field(min_length=6)
    confirm_password: str = Field(min_length=6)

    @model_validator(mode="after")
    def check_passwords_match(self):
        pw1 = self.password
        pw2 = self.confirm_password
        if pw1 is not None and pw2 is not None and pw1 != pw2:
            raise ValueError("passwords do not match")
        return self


class PasswordResetMoreCompleteData(PasswordResetCompleteData):
    old_password: str
