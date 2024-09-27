from src.lm.prompts import QUESTION_CLASSIFICAITON_SYSPROMPT as SYSPROMPT

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import JsonOutputParser

from src.lm.generate_events import lm_model_essay as lm_model


def validate_question(question: str) -> dict:
    messages = [SystemMessage(content=SYSPROMPT), HumanMessage(content=question)]
    result = lm_model.invoke(messages)
    parser = JsonOutputParser()
    points = parser.invoke(result)

    if points.get("is_valid") == "Yes":
        points["is_valid"] = True
    else:
        points["is_valid"] = False

    return points
