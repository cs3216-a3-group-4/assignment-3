from datetime import datetime
from pydantic import BaseModel, ConfigDict
from src.categories.schemas import CategoryDTO
from src.events.models import ArticleSource


class ArticleDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    summary: str
    body: str
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


class AnalysisDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    category: CategoryDTO
    content: str


class GPQuestionDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    question: str
    is_llm_generated: bool
    categories: list[CategoryDTO]


class EventDTO(MiniEventDTO):
    model_config = ConfigDict(from_attributes=True)
    analysises: list[AnalysisDTO]
    gp_questions: list[GPQuestionDTO]


class EventIndexResponse(BaseModel):
    total_count: int
    count: int
    data: list[MiniEventDTO]
