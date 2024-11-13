from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from src.essays.schemas import CommentDTO
from src.events.schemas import ArticleDTO


class DailyPracticeDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    date: datetime
    article: ArticleDTO
    question: str

    practice_title: str
    practice_intro: str
    practice_hook_title: str
    practice_hook_question: str

    attempts: list["ScuffedAttemptDTO"]


class ScuffedAttemptDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    comments: list[CommentDTO]
    points: list["DailyPracticeAttemptPointDTO"]


class DailyPracticeAttemptBaseDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    daily_practice: DailyPracticeDTO


class DailyPracticeAttemptPointDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    content: str


class DailyPracticeAttemptDTO(DailyPracticeAttemptBaseDTO):
    comments: list[CommentDTO]
    points: list[DailyPracticeAttemptPointDTO]


class CreateDailyPracticeAttemptDTO(BaseModel):
    points: list[str]
