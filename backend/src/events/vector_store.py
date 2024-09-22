from uuid import uuid4
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings

from src.common.constants import LANGCHAIN_API_KEY
from src.common.constants import LANGCHAIN_TRACING_V2
from src.common.constants import OPENAI_API_KEY
import os

os.environ["LANGCHAIN_TRACING_V2"] = LANGCHAIN_TRACING_V2
os.environ["LANGCHAIN_API_KEY"] = LANGCHAIN_API_KEY
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

db = Chroma("points", OpenAIEmbeddings())

from langchain_core.documents import Document

from src.events.generate_events import generate_events

def store_documents():
    events = generate_events()
    print(events)
    id = 0
    documents = []
    for event in events:
        document = Document(
            page_content=event.analysis,
            metadata={
                "title": event.title,
                "description": event.description,
                "categories": str(event.categories),
                "is_singapore": event.is_singapore,
            },
            id=id
        )
        documents.append(document)
        id += 1
    uuids = [str(uuid4()) for _ in range(len(documents))]
    db.add_documents(documents=documents, ids=uuids)
        

    return db


if __name__ == "__main__":
    cur_db = store_documents()
    query = "Governments should give freedom to the press to report on any issue"

    docs = cur_db.similarity_search_with_relevance_scores(query, k = 3)
    print(docs[0])
    print(docs[1])
    print(docs[2])