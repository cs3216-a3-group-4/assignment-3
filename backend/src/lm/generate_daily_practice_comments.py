from langchain_core.messages import HumanMessage, SystemMessage

from src.events.models import Article
from src.lm.lm import lm_model_essay as lm_model
from src.lm.prompts import PRACTICE_ESSAY_COMMENT_GEN_SYSPROMPT as COMMENT_SYSPROMPT
from src.lm.prompts import PRACTICE_ESSAY_QUESTION_GEN_SYSPROMPT as QUESTION_SYSPROMPT


def generate_practice_comments(points: str) -> str:
    """
    Given a list of points, generate practice comments for the points.
    """
    messages = [
        SystemMessage(content=COMMENT_SYSPROMPT),
        HumanMessage(content=points),
    ]

    response = lm_model.invoke(messages)

    return response.content


def generate_practice_question(article: Article) -> str:
    """
    Given an article, generate 1 practice question for the article.
    """
    messages = [
        SystemMessage(content=QUESTION_SYSPROMPT),
        HumanMessage(content=article.title + " " + article.content),
    ]

    response = lm_model.invoke(messages)

    return response.content


if __name__ == "__main__":
    print(generate_practice_comments("The sky is blue. The grass is green."))
