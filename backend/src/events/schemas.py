from datetime import datetime
from pydantic import BaseModel, ConfigDict
from src.categories.schemas import CategoryDTO


class EventDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    analysis: str
    is_singapore: bool
    date: datetime

    categories: list[CategoryDTO]


class EventIndexResponse(BaseModel):
    total_count: int
    count: int
    data: list[EventDTO]
