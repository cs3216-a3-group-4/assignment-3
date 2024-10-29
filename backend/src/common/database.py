from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, with_loader_criteria
from src.common.base import Base
from src.common.constants import DATABASE_URL


engine = create_engine(DATABASE_URL, echo=True)


@event.listens_for(Session, "do_orm_execute")
def _add_filtering_criteria(execute_state):
    skip_filter = execute_state.execution_options.get("skip_filter", False)
    if execute_state.is_select and not skip_filter:
        execute_state.statement = execute_state.statement.options(
            with_loader_criteria(
                Base,
                lambda cls: cls.deleted_at.is_(None),
                include_aliases=True,
            )
        )
