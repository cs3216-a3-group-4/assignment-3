from fastapi import APIRouter, Depends
from sqlalchemy import select
from src.events.models import Category
from src.categories.schemas import CategoryDTO
from src.common.dependencies import get_session


router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("/")
def get_categories(session=Depends(get_session)) -> list[CategoryDTO]:
    categories = session.scalars(select(Category))
    category_dtos = [CategoryDTO.model_validate(category) for category in categories]
    return category_dtos
