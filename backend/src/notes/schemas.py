from pydantic import BaseModel, ConfigDict
from src.notes.models import NoteType


class NoteDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    content: str

    start_index: int
    end_index: int

    parent_id: int
    parent_type: NoteType


class NoteCreate(BaseModel):
    content: str
    start_index: int
    end_index: int

    parent_id: int
    parent_type: NoteType


class NoteUpdate(BaseModel):
    content: str
    start_index: int
    end_index: int
