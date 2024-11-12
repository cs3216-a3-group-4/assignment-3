from langchain_core.messages import HumanMessage, SystemMessage

from src.lm.lm import lm_model_essay as lm_model
from src.lm.prompts import PRACTICE_ESSAY_COMMENT_GEN_SYSPROMPT as SYSPROMPT


def generate_practice_comments(points: str) -> str:
    """
    Given a list of points, generate practice comments for the points.
    """
    messages = [
        SystemMessage(content=SYSPROMPT),
        HumanMessage(content=points),
    ]

    response = lm_model.invoke(messages)

    return response.content


if __name__ == "__main__":
    print(generate_practice_comments("The sky is blue. The grass is green."))
