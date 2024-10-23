from typing import Generic, TypeVar

from pydantic import BaseModel

DataT = TypeVar("DataT")


class IndexResponse(BaseModel, Generic[DataT]):
    total_count: int
    count: int
    data: list[DataT]
