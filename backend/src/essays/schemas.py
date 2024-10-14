from pydantic import BaseModel, ConfigDict, Field
from src.essays.models import Inclination, ParagraphType
from src.events.schemas import AnalysisMiniDTO, AnalysisToEventDTO


class ParagraphDTO(BaseModel):
    content: str
    type: ParagraphType


class EssayCreate(BaseModel):
    question: str
    paragraphs: list[ParagraphDTO] = Field(min_length=1)


class EssayCreateDTO(BaseModel):
    essay_id: int


class EssayMiniDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    question: str


class CommentAnalysisDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    skill_issue: str
    analysis: AnalysisToEventDTO


class CommentDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    lack_example: bool
    inclination: Inclination
    content: str

    comment_analysises: list[CommentAnalysisDTO]


class ParagraphDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    content: str

    comments: list[CommentDTO]


class EssayDTO(EssayMiniDTO):
    comments: list[CommentDTO]
    paragraphs: list[ParagraphDTO]
