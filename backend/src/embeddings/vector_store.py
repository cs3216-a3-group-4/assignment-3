import asyncio
from typing import List, TypedDict
from langchain_openai import OpenAIEmbeddings

from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec
from langchain_core.documents import Document

from sqlalchemy import exists, select
from src.common.constants import LANGCHAIN_API_KEY
from src.common.constants import OPENAI_API_KEY
from src.common.constants import PINECONE_API_KEY

from src.events.models import Analysis, Article, Event
from sqlalchemy.orm import Session
from src.common.database import engine

import os
import time

os.environ["LANGCHAIN_API_KEY"] = LANGCHAIN_API_KEY
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY


pc = Pinecone(api_key=PINECONE_API_KEY)


def create_vector_store(index_name: str = None):
    existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]

    if index_name not in existing_indexes:
        pc.create_index(
            name=index_name,
            dimension=3072,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        )
        while not pc.describe_index(index_name).status["ready"]:
            time.sleep(1)

    index = pc.Index(index_name)

    print(index)

    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

    vector_store = PineconeVectorStore(index=index, embedding=embeddings)

    return vector_store


vector_store = create_vector_store("prod-index-embedding-3-model")


def get_is_singapore(event_id):
    with Session(engine) as session:
        event = session.scalars(select(Event).where(Event.id == event_id)).first()
        if event:
            return event.is_singapore
        return "Unknown"


def get_analyses_from_useful_articles(limit: int = None):
    with Session(engine) as session:
        # Set of all useful articles
        article_subquery = select(Article).where(Article.useless == False)  # noqa F4101

        # Get all events coming from useful articles
        event_subquery = select(Event).where(
            exists(article_subquery.where(Event.original_article_id == Article.id))
        )

        # Get all analyses coming from useful articles
        query = select(Analysis).where(
            exists(event_subquery.where(Analysis.event_id == Event.id))
        )

        if limit:
            query = query.limit(limit)

        analyses = session.scalars(query).all()

        return analyses


async def store_documents_async(
    analysis_list: List[Analysis], semaphore: asyncio.Semaphore
):
    documents: list[Document] = []
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

    async with semaphore:
        await vector_store.aadd_documents(documents=documents, ids=ids)

    print(f"Completed storing {len(documents)} documents")


async def store_analyses_embeddings_async(
    analysis_list: List[Analysis], batch_size: int = 100
):
    semaphore = asyncio.Semaphore(batch_size)
    tasks = []
    for i in range(0, len(analysis_list), batch_size):
        tasks.append(
            store_documents_async(analysis_list[i : i + batch_size], semaphore)
        )

    await asyncio.gather(*tasks)

    print(f"Stored total {len(analysis_list)} documents. Task completed.")


def store_documents(analysis_list: List[Analysis]):
    documents: list[Document] = []
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


class AnalysisLMType(TypedDict):
    id: int  # this is a guess
    event_id: int
    category_id: int
    content: str
    score: float


async def get_similar_results(query: str, top_k: int = 3, filter_sg: bool = False):
    # NOTE: filter_sg == False means all examples are allowed, not just Singapore examples
    filter_dict = {"is_singapore": True} if filter_sg else {}

    documents = await vector_store.asimilarity_search_with_relevance_scores(
        query=query,
        k=top_k,
        filter=filter_dict,
    )
    results: list[AnalysisLMType] = []
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
    # pass
    docs = asyncio.run(
        vector_store.asimilarity_search_with_relevance_scores(
            query="Censorship is necessary in Singapore because it helps to maintain social harmony and prevent racial and religious tensions, which are crucial in a multicultural society where diverse beliefs coexist",
            k=3,
            filter={},
        )
    )
    print(docs)

    # NOTE: this is for repopulation of the entire database
    # analyses = get_analyses_from_useful_articles(3000)
    # # start timer
    # start = time.time()
    # store_documents(analyses)
    # # end timer
    # end = time.time()
    # print(f"Time taken: {end - start}")
