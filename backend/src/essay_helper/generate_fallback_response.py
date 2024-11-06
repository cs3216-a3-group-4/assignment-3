from src.essay_helper.prompts import (
    ESSAY_HELPER_FALLBACK_PROMPT_CONCEPTS as FALLBACK_SYSPROMPT,
)
from src.lm.dict_types import FallbackType
from src.lm.lm import lm_model_essay as lm_model

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import JsonOutputParser


def generate_fallback_response(question: str, point: str) -> FallbackType:
    messages = [
        SystemMessage(content=FALLBACK_SYSPROMPT),
        HumanMessage(content=f"Question: {question}\nPoint: {point}"),
    ]

    result = lm_model.invoke(messages)
    parser = JsonOutputParser()
    return parser.invoke(result)
