import json
from langchain_core.messages import HumanMessage, SystemMessage
from src.essay_helper.dict_types import PointValidationResultType
from src.lm.lm import lm_model_essay as lm_model
from langchain_core.output_parsers import JsonOutputParser

from src.essay_helper.prompts import POINT_VALIDATION_PROMPT as SYSPROMPT


def validate_point(point: str, question: str) -> PointValidationResultType:
    """
    Validate a user-provided point for an essay question.
    """
    input = f"""
        Question: "{question}"
        Point: "{point}"
        """
    messages = [
        SystemMessage(content=SYSPROMPT),
        HumanMessage(content=input),
    ]

    parser = JsonOutputParser()
    result = lm_model.invoke(messages)
    result = parser.invoke(result)

    if result.get("valid") == "True":
        result["valid"] = True
    else:
        result["valid"] = False

    return result


if __name__ == "__main__":
    point = "Advertisement are harmful because they promote consumerism."
    question = (
        "Discuss the view that advertisements today are more harmful than beneficial."
    )
    result = validate_point(point, question)
    print(json.dumps(result, indent=2))
