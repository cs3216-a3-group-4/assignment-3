from http import HTTPStatus
from typing import Annotated

from fastapi import Depends, HTTPException
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session
from src.limits.models import Usage


def has_essay_tries_left(
    user: Annotated[User, Depends(get_current_user)],
    session=Depends(get_session),
):
    usage = session.get(Usage, user.id)
    if not usage:
        usage = Usage(user_id=user.id)
        # This is inefficient, refactor in the future.
        session.add(usage)
        session.commit()

    user_tier_limit = user.tier.essay_limit
    user_essay_usage = usage.essays
    if user_tier_limit - user_essay_usage <= 0:
        raise HTTPException(HTTPStatus.TOO_MANY_REQUESTS)

    usage.essays += 1
    session.add(usage)
    session.commit()
