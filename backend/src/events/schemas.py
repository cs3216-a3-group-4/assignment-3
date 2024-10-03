from datetime import datetime
from pydantic import BaseModel, ConfigDict
from src.categories.schemas import CategoryDTO
from src.events.models import ArticleSource
from src.likes.schemas import LikeDTO
from src.notes.schemas import NoteDTO


class ArticleDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    summary: str
    url: str
    source: ArticleSource
    date: datetime
    image_url: str


class ReadDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    first_read: datetime
    last_read: datetime


class MiniEventDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    is_singapore: bool
    date: datetime

    categories: list[CategoryDTO]
    original_article: ArticleDTO
    reads: list[ReadDTO]


class AnalysisMiniDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    category: CategoryDTO
    content: str
    likes: list[LikeDTO]


class AnalysisDTO(AnalysisMiniDTO):
    notes: list[NoteDTO]


class GPQuestionDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    question: str
    is_llm_generated: bool
    categories: list[CategoryDTO]


class BookmarkDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    user_id: int


class EventDTO(MiniEventDTO):
    model_config = ConfigDict(from_attributes=True)
    analysises: list[AnalysisDTO]
    gp_questions: list[GPQuestionDTO]
    bookmarks: list[BookmarkDTO]
    notes: list[NoteDTO]


class EventIndexResponse(BaseModel):
    total_count: int
    count: int
    data: list[MiniEventDTO]
