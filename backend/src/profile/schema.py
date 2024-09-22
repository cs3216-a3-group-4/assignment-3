from pydantic import BaseModel


class ProfileUpdate(BaseModel):
    category_ids: list[int]
