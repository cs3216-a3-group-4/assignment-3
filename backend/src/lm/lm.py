from src.common.constants import LANGCHAIN_API_KEY, OPENAI_API_KEY
from langchain_openai import ChatOpenAI
import os

os.environ["LANGCHAIN_API_KEY"] = LANGCHAIN_API_KEY
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

lm_model = ChatOpenAI(model="gpt-4o-mini", temperature=0.3, max_retries=5)

lm_model_concept = ChatOpenAI(model="gpt-4o-mini", temperature=0.9, max_retries=5)

lm_model_essay = ChatOpenAI(
    model="gpt-4o-mini", temperature=0.6, frequency_penalty=0.5, max_retries=5
)

CONCURRENCY = 150
