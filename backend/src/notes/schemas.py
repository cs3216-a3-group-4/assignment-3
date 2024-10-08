from datetime import datetime
from pydantic import BaseModel, ConfigDict
from src.categories.schemas import CategoryDTO
from src.notes.models import NoteType


class NoteDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    content: str

    start_index: int | None = None
    end_index: int | None = None

    parent_id: int
    parent_type: NoteType

    category: CategoryDTO | None = None

    created_at: datetime
    updated_at: datetime


class NoteCreate(BaseModel):
    content: str
    start_index: int | None = None
    end_index: int | None = None

    parent_id: int
    parent_type: NoteType
    category_id: int | None = None


class NoteUpdate(BaseModel):
    content: str
    start_index: int | None = None
    end_index: int | None = None
    category_id: int
