from fastapi import Depends
from src.common.dependencies import get_session
from src.limits.models import Usage, Tier


def checkUsage(user, session=Depends(get_session)) -> bool:
    usage = session.get(Usage, user.id)

    if not usage:
        usage = Usage(user_id=user.id, gp_question_asked=1)
        session.add(usage)
        session.commit()
        return True

    tier = session.get(Tier, user.tier_id)

    if usage.gp_question_asked >= tier.gp_question_limit:
        return False

    usage.gp_question_asked += 1
    session.commit()
    return True
