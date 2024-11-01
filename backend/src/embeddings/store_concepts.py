import asyncio
from sqlalchemy import select
from src.embeddings.vector_store import vector_store

from src.events.models import ArticleConcept, Concept, Event
from langchain_core.documents import Document


from src.common.database import engine
from sqlalchemy.orm import Session

CONCURRENCY = 150


def fetch_all_article_concepts(limit: int = None) -> list[ArticleConcept]:
    with Session(engine) as session:
        query = select(ArticleConcept)
        if limit:
            query = query.limit(limit)
        return session.scalars(query).all()


async def store_concepts_async(concepts: list[ArticleConcept], batch_size: int = 100):
    semaphore = asyncio.Semaphore(CONCURRENCY)
    tasks = []
    for i in range(0, len(concepts), batch_size):
        tasks.append(store_concept_batch(concepts[i : i + batch_size], semaphore))

    await asyncio.gather(*tasks)
    print(f"Completed storing total: {len(concepts)} concepts")


def get_is_singapore(article_id: int) -> bool:
    with Session(engine) as session:
        event = session.scalars(
            select(Event).where(Event.original_article_id == article_id)
        ).first()
        return event.is_singapore


def get_concept_name(concept_id: int) -> str:
    with Session(engine) as session:
        concept = session.scalar(select(Concept).where(Concept.id == concept_id))
        return concept.name


async def store_concept_batch(
    concept_list: list[ArticleConcept], semaphore: asyncio.Semaphore
):
    documents: list[Document] = []
    for concept in concept_list:
        concept_content = (
            get_concept_name(concept.concept_id) + ": " + concept.explanation
        )
        document = Document(
            page_content=concept_content,
            metadata={
                "concept_id": concept.concept_id,
                "article_id": concept.article_id,
                "is_singapore": get_is_singapore(concept.article_id),
            },
        )
        documents.append(document)

    ids = [
        str(document.metadata["concept_id"])
        + "-"
        + str(document.metadata["article_id"])
        for document in documents
    ]

    async with semaphore:
        await vector_store.aadd_documents(documents=documents, ids=ids)

    print(f"Completed storing batch of {len(documents)} concepts")


if __name__ == "__main__":
    concepts = fetch_all_article_concepts(1000)
    asyncio.run(store_concepts_async(concepts))
