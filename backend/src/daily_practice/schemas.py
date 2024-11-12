from pydantic import BaseModel, ConfigDict
from src.essays.schemas import CommentDTO
from src.events.schemas import ArticleDTO


class DailyPracticeDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    article: ArticleDTO
    question: str


class DailyPracticeAttemptBaseDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    daily_practice: DailyPracticeDTO


class DailyPracticeAttemptDTO(DailyPracticeAttemptBaseDTO):
    comments: list[CommentDTO]


class CreateDailyPracticeAttemptDTO(BaseModel):
    points: list[str]
