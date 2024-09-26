from pydantic import BaseModel


class ProfileUpdate(BaseModel):
    category_ids: list[int] = None
    top_events_period: int = 7
