from pydantic import BaseModel, ConfigDict, model_validator
from src.events.schemas import MiniEventDTO
from src.likes.schemas import LikeDTO


class AnalysisDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    content: str
    event: MiniEventDTO
    likes: list[LikeDTO]


class PointAnalysisDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    analysis: AnalysisDTO
    elaboration: str

    @model_validator(mode="after")
    def filter(self):
        # i gave up on using the orm to filter the ones relevant to the point
        self.analysis.likes = [
            like for like in self.analysis.likes if like.point_id == self.id
        ]
        return self


class FallbackDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    alt_approach: str
    general_argument: str


class PointMiniDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    body: str
    point_analysises: list[PointAnalysisDTO]
    fallback: FallbackDTO | None = None


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
