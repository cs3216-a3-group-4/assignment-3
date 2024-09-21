from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings

db = Chroma("points", OpenAIEmbeddings())

from langchain_core.documents import Document

