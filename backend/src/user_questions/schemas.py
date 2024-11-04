from pydantic import BaseModel, ConfigDict, model_validator
from src.events.schemas import ArticleConceptDTO, MiniEventDTO
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
    point_id: int

    @model_validator(mode="after")
    def filter(self):
        # i gave up on using the orm to filter the ones relevant to the point
        self.analysis.likes = [
            like for like in self.analysis.likes if like.point_id == self.point_id
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
    positive: bool


class PointDTO(PointMiniDTO):
    point_analysises: list[PointAnalysisDTO]
    fallback: FallbackDTO | None = None
    likes: list[LikeDTO]


class AnswerDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    points: list[PointDTO]


class AnswerMiniDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    points: list[PointMiniDTO]


class UserQuestionDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    question: str
    answer: AnswerDTO


class UserQuestionMiniDTO(BaseModel):
    id: int
    question: str
    answer: AnswerMiniDTO


class ValidationResult(BaseModel):
    is_valid: bool
    error_message: str


class CreateUserQuestion(BaseModel):
    question: str


# Concept-based essay helper response models
class PointArticleConceptDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    article_concept: ArticleConceptDTO
    elaboration: str
    point_id: int

    # NOTE: Not sure if I need the model_validator part here @seelengxd


class CPointDTO(PointMiniDTO):
    point_article_concepts: list[PointArticleConceptDTO]
    fallback: FallbackDTO | None = None
    likes: list[LikeDTO]


class ConceptAnswerDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    points: list[CPointDTO]


class UserQuestionConceptDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    question: str
    answer: ConceptAnswerDTO
