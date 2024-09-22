from pydantic import BaseModel, EmailStr


class ProfileUpdate(BaseModel):
    category_ids: list[int]
