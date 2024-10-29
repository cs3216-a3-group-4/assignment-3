from pydantic import BaseModel, ConfigDict
from src.limits.models import TierNames


class UsageDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    gp_question_asked: int


class TierDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    tier_name: TierNames
    label: str
    gp_question_limit: int
