from pydantic import BaseModel, ConfigDict, Field
from src.essays.models import Inclination
from src.events.schemas import AnalysisMiniDTO


class EssayCreate(BaseModel):
    question: str
    paragraphs: list[str] = Field(min_length=1)


class EssayMiniDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    question: str


class CommentAnalysisDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    skill_issue: str
    analysis: AnalysisMiniDTO


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
