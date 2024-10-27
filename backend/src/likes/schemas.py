from pydantic import BaseModel, ConfigDict
from src.likes.models import LikeType


class LikeData(BaseModel):
    point_id: int | None = None
    concept_id: int | None = None
    article_id: int | None = None
    analysis_id: int | None = None

    # 1 for Like, -1 for Dislike
    type: LikeType


class LikeDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    point_id: int | None = None
    analysis_id: int | None = None
    # 1 for Like, -1 for Dislike
    type: LikeType
    user_id: int
