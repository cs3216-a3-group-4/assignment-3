from pydantic import BaseModel, ConfigDict, model_validator
from src.events.schemas import MiniEventDTO
from src.likes.schemas import LikeDTO


class AnalysisDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    content: str
    event: MiniEventDTO
    likes: list[LikeDTO]


class PointMiniDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    body: str
    analysises: list[AnalysisDTO]

    @model_validator(mode="after")
    def filter(self):
        # i gave up on using the orm to filter the ones relevant to the point
        for analysis in self.analysises:
            analysis.likes = [
                like for like in analysis.likes if like.point_id == self.id
            ]
        return self


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
