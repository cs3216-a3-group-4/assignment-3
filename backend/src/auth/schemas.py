from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserPublic


class SignUpData(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
