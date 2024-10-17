from pydantic import BaseModel
from sqlalchemy import exists, select
from src.events.models import Analysis, AnalysisConcept, Concept, Event

from sqlalchemy.orm import Session, selectinload
from src.common.database import engine

import json

from langchain_core.messages import SystemMessage
from langchain_core.output_parsers import JsonOutputParser

from src.lm.lm import lm_model
import asyncio

CONCEPTS_FILE_PATH = "concepts_output.json"
CONCURRENCY = 150


class AnalysisConceptLM(BaseModel):
    concept: str
    explanation: str


class AnalysisConcepts(BaseModel):
    concepts: list[AnalysisConceptLM]


class AnalysisConceptsWithId(AnalysisConcepts):
    analysis_id: int


async def generate_concept_from_analysis(
    analysis: Analysis, res: list[AnalysisConceptsWithId], semaphore: asyncio.Semaphore
):
    async with semaphore:
        while True:
            try:
                content: str = analysis.content  # noqa: F841

                # TODO(marcus): fill this in
                messages = [
                    SystemMessage(
                        content='Can you reply {"concepts":[{"concept": "test", "explanation": "test"}]}'
                    ),
                    # HumanMessage(content="placeholder"),
                ]

                result = await lm_model.ainvoke(messages)
                parser = JsonOutputParser(pydantic_object=AnalysisConcepts)
                concepts = parser.invoke(result)
                print(f"Model temp: {lm_model.temperature}")
                break
            except Exception as e:  # noqa: E722
                print(e)
                print("hit the rate limit! waiting 10s for analysis", analysis.id)
                await asyncio.sleep(10)
    res.append(
        AnalysisConceptsWithId(concepts=concepts["concepts"], analysis_id=analysis.id)
    )


async def generate_concepts(limit: int | None = None, add_to_db: bool = True):
    with Session(engine) as session:
        # query db for analysis
        subquery = select(AnalysisConcept.analysis_id)
        query = (
            select(Analysis)
            .where(~exists(subquery.where(AnalysisConcept.analysis_id == Analysis.id)))
            .options(selectinload(Analysis.event).selectinload(Event.original_article))
        )
        if limit:
            query = query.limit(limit)
        analyses = session.scalars(query).all()

        # call blackbox lm function
        res: list[AnalysisConceptsWithId] = []
        semaphore = asyncio.Semaphore(CONCURRENCY)
        async with asyncio.TaskGroup() as tg:
            for analysis in analyses:
                tg.create_task(generate_concept_from_analysis(analysis, res, semaphore))

        if add_to_db:
            # first, lowercase all concepts in result
            concepts: list[str] = []
            for analysis_concept_with_id in res:
                for concept in analysis_concept_with_id.concepts:
                    concept.concept = concept.concept.lower()
                    concepts.append(concept.concept)

            # query concepts that match
            existing_concepts = session.scalars(
                select(Concept).where(Concept.name.in_(concepts))
            ).all()

            concept_map = {
                existing_concept.name: existing_concept
                for existing_concept in existing_concepts
            }

            # add concept to db if not exist
            existing_concept_names = [concept.name for concept in existing_concepts]

            missing_concepts_string = set()
            for analysis_concept_with_id in res:
                for concept in analysis_concept_with_id.concepts:
                    concept_name = concept.concept
                    if concept_name not in existing_concept_names:
                        missing_concepts_string.add(concept_name)

            missing_concepts = [
                Concept(name=concept) for concept in missing_concepts_string
            ]
            session.add_all(missing_concepts)
            session.commit()

            for concept in missing_concepts:
                session.refresh(concept)
                concept_map[concept.name] = concept

            # add new models to db
            results = []
            for analysis_concept_with_id in res:
                for analysis_concept_llm in analysis_concept_with_id.concepts:
                    results.append(
                        AnalysisConcept(
                            analysis_id=analysis_concept_with_id.analysis_id,
                            explanation=analysis_concept_llm.explanation,
                            concept_id=concept_map[analysis_concept_llm.concept].id,
                        )
                    )

            session.add_all(results)
            session.commit()

        # return json in case you need it for something
        with open(CONCEPTS_FILE_PATH, "w") as json_file:
            json.dump([dto.model_dump() for dto in res], json_file, indent=4)
        return res


if __name__ == "__main__":
    # TODO(marcus): probably remove/change this
    asyncio.run(generate_concepts(5))
