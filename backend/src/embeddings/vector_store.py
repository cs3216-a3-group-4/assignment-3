from uuid import uuid4
from langchain_openai import OpenAIEmbeddings

from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec
from langchain_core.documents import Document

from src.common.constants import LANGCHAIN_API_KEY
from src.common.constants import LANGCHAIN_TRACING_V2
from src.common.constants import OPENAI_API_KEY
from src.common.constants import PINECONE_API_KEY

import os
import time

os.environ["LANGCHAIN_TRACING_V2"] = LANGCHAIN_TRACING_V2
os.environ["LANGCHAIN_API_KEY"] = LANGCHAIN_API_KEY
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY


pc = Pinecone(api_key=PINECONE_API_KEY)


def create_vector_store():
    index_name = "langchain-test-index-3"  # change to create a new index

    existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]

    if index_name not in existing_indexes:
        pc.create_index(
            name=index_name,
            dimension=1536,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        )
        while not pc.describe_index(index_name).status["ready"]:
            time.sleep(1)

    index = pc.Index(index_name)

    print(index)

    embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")

    vector_store = PineconeVectorStore(index=index, embedding=embeddings)

    return vector_store


vector_store = create_vector_store()


def store_documents(events: list[dict]):
    # print(events)
    id = 0
    documents = []
    for event in events:
        analysis_list = event.get("analysis_list")
        for analysis in analysis_list:
            document = Document(
                page_content=analysis.get("analysis"),
                metadata={
                    "title": event.get("title"),
                    "description": event.get("description"),
                    "categories": str(event.get("categories")),
                    "is_singapore": event.get("is_singapore"),
                    "questions": event.get("questions"),
                },
                id=id,
            )
            documents.append(document)
            id += 1

    uuids = [str(uuid4()) for _ in range(len(documents))]
    vector_store.add_documents(documents=documents, ids=uuids)
    print("Job done")


# if __name__ == "__main__":
#     # store_documents()
#     query = "There is a need for more stringent regulations on social media platforms."
#     docs = vector_store.similarity_search_with_relevance_scores(query, k=3)
#     if len(docs) == 0:
#         print("No documents found")
#     for doc in docs:
#         print(doc)
