from src.limits.models import Usage, Tier
from src.user_questions.schemas import ValidationResult


def within_usage_limit(user, session) -> bool:
    usage = session.get(Usage, user.id)

    if not usage:
        usage = Usage(user_id=user.id, gp_question_asked=0)
        session.add(usage)
        session.commit()
        return True, ValidationResult(is_valid=True, error_message="")

    tier = session.get(Tier, user.tier_id)
    if usage.gp_question_asked >= tier.gp_question_limit:
        return False, ValidationResult(
            is_valid=False,
            error_message=f"You have reached your question limit of {tier.gp_question_limit} for the week.",
        )

    usage.gp_question_asked += 1
    session.commit()
    return True, ValidationResult(is_valid=True, error_message="")
