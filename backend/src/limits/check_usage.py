from src.limits.models import Usage, Tier
from src.lm.validate_question import validate_question
from src.user_questions.schemas import ValidationResult


def within_usage_limit(user, session, question: str) -> ValidationResult:
    usage = session.get(Usage, user.id)

    # First time usage, populate db with zero questions asked
    if not usage:
        usage = Usage(user_id=user.id, gp_question_asked=0)
        session.add(usage)
        session.commit()

    tier = session.get(Tier, user.tier_id)
    # If user has reached their question limit, we simply return an error message, no need for LM validation
    if usage.gp_question_asked >= tier.gp_question_limit:
        return ValidationResult(
            is_valid=False,
            error_message=f"You have reached your question limit of {tier.gp_question_limit} for the week.",
        )
    else:
        # If user has not reached their limit, we validate the question
        question_validation = validate_question(question)
        if not question_validation["is_valid"]:
            # If question is invalid, simply return error without increment
            return ValidationResult(
                is_valid=False, error_message=question_validation["error_message"]
            )

    # If question is valid, increment usage and return success

    usage.gp_question_asked += 1
    session.commit()
    return ValidationResult(is_valid=True, error_message="")
