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

    category: CategoryDTO


class NoteCreate(BaseModel):
    content: str
    start_index: int | None = None
    end_index: int | None = None

    parent_id: int
    parent_type: NoteType
    category_id: int


class NoteUpdate(BaseModel):
    content: str
    start_index: int
    end_index: int
    category_id: int
