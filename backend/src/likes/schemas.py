from pydantic import BaseModel
from src.likes.models import LikeType


class LikeData(BaseModel):
    point_id: int | None = None
    analysis_id: int
    # 1 for Like, -1 for Dislike
    type: LikeType


class LikeDTO(BaseModel):
    point_id: int | None = None
    analysis_id: int
    # 1 for Like, -1 for Dislike
    type: LikeType
    user_id: int
