from langchain_core.messages import HumanMessage, SystemMessage
from src.lm.prompts import (
    SOCIETY_QUESTION_CLASSIFICATION_SYSPROMPT as SOCIETY_SYSPROMPT,
)
from src.lm.lm import lm_model_essay as lm_model


def classify_society_qn(question: str) -> bool:
    # NOTE: if the words "In your society" are in the question, then there is no doubt
    if "in your society" in question.lower():
        return True

    # Otherwise, we let the LM decide
    messages = [
        SystemMessage(content=SOCIETY_SYSPROMPT),
        HumanMessage(content=question),
    ]
    result = lm_model.invoke(messages)
    if result.content == "Yes":
        return True
    return False
