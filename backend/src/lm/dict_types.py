from typing import TypedDict
from src.embeddings.store_concepts import ArticleConceptLLMType
from src.embeddings.vector_store import AnalysisLMType
from src.essays.models import Inclination


type Point = str


# generate_essay_comments.py
class LMCommentType(TypedDict):
    comment: str
    inclination: Inclination
    lacking_examples: bool


class CommentsType(TypedDict):
    comments: list[LMCommentType]


# generate_points.py
class PointsType(TypedDict):
    for_points: list[Point]
    against_points: list[Point]


class PointWithAnalysisType(TypedDict):
    point: Point
    analyses: list[AnalysisLMType]


class AllPointsWithAnalysisType(TypedDict):
    for_points: list[PointWithAnalysisType]
    against_points: list[PointWithAnalysisType]


# generate_response.py
class ElaboratedAnalysisType(AnalysisLMType):
    elaborations: str


class FallbackType(AnalysisLMType):
    alt_approach: str
    general_argument: str


class PointWithAnalysisAndLLMType(TypedDict):
    analyses: list[ElaboratedAnalysisType]
    fall_back_response: FallbackType | None = None


class PointsAfterLLMType(TypedDict):
    for_points: list[PointWithAnalysisAndLLMType]
    against_points: list[PointWithAnalysisAndLLMType]


# generate_concept_response.py


class PointWithConceptsType(TypedDict):
    point: str
    concepts: list[ArticleConceptLLMType]


class AllPointsWithConceptsType(TypedDict):
    for_points: list[PointWithConceptsType]
    against_points: list[PointWithConceptsType]


class PointWithConceptsAndLLMType(PointWithConceptsType):
    elaborations: str


class PointsWithConceptsAfterLLMType(TypedDict):
    for_points: list[PointWithConceptsAndLLMType]
    against_points: list[PointWithConceptsAndLLMType]
