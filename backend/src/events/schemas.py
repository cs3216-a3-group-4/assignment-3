from datetime import datetime
from pydantic import BaseModel, ConfigDict
from src.categories.schemas import CategoryDTO
from src.common.schemas import IndexResponse
from src.events.models import ArticleSource
from src.likes.schemas import LikeDTO
from src.notes.schemas import NoteDTO


class BaseArticleDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    summary: str
    url: str
    source: ArticleSource
    date: datetime
    image_url: str


class MiniArticleDTO(BaseArticleDTO):
    categories: list[CategoryDTO]


class ArticleDTO(MiniArticleDTO):
    article_concepts: list["ArticleConceptDTO"]
    original_events: list["EventWithoutArticleDTO"]
    bookmarks: list["BookmarkDTO"]
    notes: list[NoteDTO]


# Refactor this one day. :(
class EventWithoutArticleDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    is_singapore: bool
    date: datetime
    analysises: list["AnalysisDTO"]
    notes: list["NoteDTO"]


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
    original_article: BaseArticleDTO


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


class ConceptMiniDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    likes: list[LikeDTO]


class ConceptDTO(ConceptMiniDTO):
    notes: list[NoteDTO]


class ArticleConceptDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    explanation: str
    concept: ConceptDTO


#  Used by /event/:id via EventDTO
class ArticlesWithConceptDTO(BaseArticleDTO):
    model_config = ConfigDict(from_attributes=True)
    article_concepts: list[ArticleConceptDTO]


class GPQuestionDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    question: str
    is_llm_generated: bool
    categories: list[CategoryDTO]


class BookmarkDTO(BaseModel):
    """Be careful when editing this model. It is used by both article/event
    despite them using two different ORM models (ArticleBookmark & Bookmark)"""

    model_config = ConfigDict(from_attributes=True)
    user_id: int


class EventDTO(MiniEventDTO):
    model_config = ConfigDict(from_attributes=True)
    analysises: list[AnalysisDTO]
    gp_questions: list[GPQuestionDTO]
    bookmarks: list[BookmarkDTO]
    notes: list[NoteDTO]


EventIndexResponse = IndexResponse[MiniEventDTO]


class EventNoteDTO(NoteDTO):
    event: "BaseEventDTO"


class AnalysisNoteDTO(NoteDTO):
    analysis: "AnalysisToEventDTO"


class ArticleNoteDTO(NoteDTO):
    article: BaseArticleDTO
