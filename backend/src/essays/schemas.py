from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from src.essays.models import Inclination, ParagraphType
from src.events.schemas import AnalysisToEventDTO, ArticleConceptWithArticleDTO
from src.likes.schemas import LikeDTO


class ParagraphDTO(BaseModel):
    content: str
    type: ParagraphType


class EssayCreate(BaseModel):
    question: str
    paragraphs: list[ParagraphDTO] = Field(min_length=1)


class EssayCreateDTO(BaseModel):
    essay_id: int


class EssayBaseDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    question: str


class EssayMiniDTO(EssayBaseDTO):
    comments: list["CommentDTO"]
    paragraphs: list[ParagraphDTO]

    created_at: datetime
    updated_at: datetime


class CommentAnalysisDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    skill_issue: str
    analysis: AnalysisToEventDTO


class CommentArticleConceptDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    skill_issue: str
    article_concept: ArticleConceptWithArticleDTO


class CommentMiniDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    lack_example: bool
    inclination: Inclination
    content: str


class CommentDTO(CommentMiniDTO):
    likes: list[LikeDTO]

    comment_analysises: list[CommentAnalysisDTO]
    comment_article_concepts: list[CommentArticleConceptDTO]


class ParagraphDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    content: str
    type: str

    comments: list[CommentDTO]


class EssayDTO(EssayBaseDTO):
    comments: list[CommentMiniDTO]
    paragraphs: list[ParagraphDTO]
