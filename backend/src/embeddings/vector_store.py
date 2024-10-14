import asyncio
from typing import List
from langchain_openai import OpenAIEmbeddings

from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec
from langchain_core.documents import Document

from sqlalchemy import select
from src.common.constants import LANGCHAIN_API_KEY
from src.common.constants import OPENAI_API_KEY
from src.common.constants import PINECONE_API_KEY

from src.events.models import Analysis, Event
from sqlalchemy.orm import Session
from src.common.database import engine

import os
import time

os.environ["LANGCHAIN_API_KEY"] = LANGCHAIN_API_KEY
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY


pc = Pinecone(api_key=PINECONE_API_KEY)


def create_vector_store():
    index_name = "prod-index-1"  # change to create a new index

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


def get_is_singapore(event_id):
    with Session(engine) as session:
        event = session.scalars(select(Event).where(Event.id == event_id)).first()
        if event:
            return event.is_singapore
        return "Unknown"


def store_documents(analysis_list: List[Analysis]):
    documents = []
    for analysis in analysis_list:
        document = Document(
            page_content=analysis.content,
            metadata={
                "id": analysis.id,
                "event_id": analysis.event_id,
                "category_id": analysis.category_id,
                "is_singapore": get_is_singapore(analysis.event_id),
            },
        )
        documents.append(document)

    ids = [
        str(document.metadata["id"])
        + "-"
        + str(document.metadata["event_id"])
        + "-"
        + str(document.metadata["category_id"])
        for document in documents
    ]
    vector_store.add_documents(documents=documents, ids=ids)

    print(f"Stored {len(documents)} documents")


async def get_similar_results(query: str, top_k: int = 3, filter_sg: bool = False):
    # NOTE: filter_sg == False means all examples are allowed, not just Singapore examples
    filter_dict = {"is_singapore": True} if filter_sg else {}

    documents = await vector_store.asimilarity_search_with_relevance_scores(
        query=query,
        k=top_k,
        filter=filter_dict,
    )
    results = []
    for document, score in documents:
        results.append(
            {
                "id": document.metadata["id"],
                "event_id": document.metadata["event_id"],
                "category_id": document.metadata["category_id"],
                "content": document.page_content,
                "score": score,
            }
        )
    return results


if __name__ == "__main__":
    docs = asyncio.run(
        vector_store.asimilarity_search_with_relevance_scores(
            query="Censorship is necessary in Singapore because it helps to maintain social harmony and prevent racial and religious tensions, which are crucial in a multicultural society where diverse beliefs coexist",
            k=3,
            filter={"is_singapore": True},
        )
    )
    print(docs)
