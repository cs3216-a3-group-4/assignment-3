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


class BaseEventDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    is_singapore: bool
    date: datetime

    categories: list[CategoryDTO]
    original_article: ArticleDTO


class MiniEventDTO(BaseEventDTO):
    reads: list[ReadDTO]


class AnalysisMiniDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    category: CategoryDTO
    content: str
    likes: list[LikeDTO]
    event_id: int


class AnalysisToEventDTO(AnalysisMiniDTO):
    event: BaseEventDTO


# Used by user_question
class AnalysisDTO(AnalysisMiniDTO):
    notes: list[NoteDTO]


class ConceptDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class AnalysisConceptDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    explanation: str
    concept: ConceptDTO


#  Used by /event/:id via EventDTO
class AnalysisWithConceptDTO(AnalysisDTO):
    model_config = ConfigDict(from_attributes=True)
    analysis_concepts: list[AnalysisConceptDTO]


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
    analysises: list[AnalysisWithConceptDTO]
    gp_questions: list[GPQuestionDTO]
    bookmarks: list[BookmarkDTO]
    notes: list[NoteDTO]


class EventIndexResponse(BaseModel):
    total_count: int
    count: int
    data: list[MiniEventDTO]


class EventNoteDTO(NoteDTO):
    event: "BaseEventDTO"


class AnalysisNoteDTO(NoteDTO):
    analysis: "AnalysisToEventDTO"
