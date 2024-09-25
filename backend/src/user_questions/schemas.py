from pydantic import BaseModel, ConfigDict
from src.events.schemas import MiniEventDTO


class AnalysisDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    content: str
    event: MiniEventDTO


class PointMiniDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    body: str
    analysises: list[AnalysisDTO]


class AnswerDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    points: list[PointMiniDTO]


class UserQuestionMiniDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    question: str
    answer: AnswerDTO


class CreateUserQuestion(BaseModel):
    question: str
