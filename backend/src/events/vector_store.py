from uuid import uuid4
from langchain_openai import OpenAIEmbeddings

from src.common.constants import LANGCHAIN_API_KEY
from src.common.constants import LANGCHAIN_TRACING_V2
from src.common.constants import OPENAI_API_KEY
from src.common.constants import PINECONE_API_KEY

import os

os.environ["LANGCHAIN_TRACING_V2"] = LANGCHAIN_TRACING_V2
os.environ["LANGCHAIN_API_KEY"] = LANGCHAIN_API_KEY
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY

from pinecone import Pinecone, ServerlessSpec

from langchain_core.documents import Document

from src.events.generate_events import generate_events

pc = Pinecone(api_key=PINECONE_API_KEY)

import time

index_name = "langchain-test-index"  # change if desired

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

embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")

from langchain_pinecone import PineconeVectorStore

vector_store = PineconeVectorStore(index=index, embedding=embeddings)

def store_documents():
    events = generate_events()
    # print(events)
    id = 0
    documents = []
    for event in events:
        document = Document(
            page_content=event.analysis_list[0].analysis,
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
    vector_store.add_documents(documents=documents, ids=uuids)
    print("Job done")
    


if __name__ == "__main__":
    # store_documents()
    query = "No, the use of performance enhancing drugs undermines the integrity of sport: The use of performance-enhancing drugs violates the principle of fair play. It creates an uneven playing field where success depends more on pharmaceutical intervention than talent or hard work, eroding the values that sports should represent."
    docs = vector_store.similarity_search_with_relevance_scores(query, k = 3)
    if (len(docs) == 0):
        print("No documents found")
    for doc in docs:
        print(doc)