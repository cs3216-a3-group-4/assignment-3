import asyncio
from sqlalchemy import select
from src.embeddings.vector_store import create_vector_store

from src.events.models import ArticleConcept, Concept, Event
from langchain_core.documents import Document


from src.common.database import engine
from sqlalchemy.orm import Session

CONCURRENCY = 150

vector_store = create_vector_store("test-concepts")


def fetch_all_article_concepts(limit: int = None) -> list[ArticleConcept]:
    with Session(engine) as session:
        query = select(ArticleConcept)
        if limit:
            query = query.limit(limit)
        return session.scalars(query).all()


async def store_concepts_async(concepts: list[ArticleConcept], batch_size: int = 200):
    semaphore = asyncio.Semaphore(CONCURRENCY)
    tasks = []
    for i in range(0, len(concepts), batch_size):
        tasks.append(store_concept_batch(concepts[i : i + batch_size], semaphore))

    await asyncio.gather(*tasks)
    print(f"Completed storing total: {len(concepts)} concepts")


def get_is_singapore(article_id: int) -> bool | str:
    with Session(engine) as session:
        event = session.scalars(
            select(Event).where(Event.original_article_id == article_id)
        ).first()
        if not event:
            return "Unknown"
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
                "concept_id": document.metadata["concept_id"],
                "article_id": document.metadata["article_id"],
                "is_singapore": document.metadata["is_singapore"],
                "score": score,
            }
        )
    return results


def get_concept_explanation(concept_id: int, article_id: int) -> str:
    with Session(engine) as session:
        concept = session.scalar(
            select(ArticleConcept)
            .where(ArticleConcept.concept_id == concept_id)
            .where(ArticleConcept.article_id == article_id)
        )
        return concept.explanation


if __name__ == "__main__":
    # concepts = fetch_all_article_concepts()
    # asyncio.run(store_concepts_async(concepts))
    point = "The value of work can indeed be assessed by the salary it commands, as higher salaries often reflect the level of skill, expertise, and responsibility required for a job"
    results = asyncio.run(get_similar_results(point, top_k=3))
    explanations = []
    for result in results:
        explanation = get_concept_explanation(
            result["concept_id"], result["article_id"]
        )
        explanations.append(explanation)

    for explanation in explanations:
        print(explanation + "\n")

    print(results)
