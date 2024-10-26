import json

from src.lm.generate_concepts import ArticleConceptsWithId, add_concepts_to_db


def populate_threads(source_file_path: str):
    """
    Read from soruce file and populate the db with concepts
    Made for 1 time use only to prevent regenerating LM concepts
    """
    with open(source_file_path, "r") as f:
        concepts = json.load(f)

    res_list: list[ArticleConceptsWithId] = []

    for concept in concepts:
        concept_obj = ArticleConceptsWithId(
            article_id=concept.get("article_id"),
            concepts=concept.get("concepts"),
            summary=concept.get("summary"),
        )
        res_list.append(concept_obj)

    add_concepts_to_db(res_list)
