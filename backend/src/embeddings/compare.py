import json
from src.embeddings.vector_store import get_similar_results
from src.embeddings.store_concepts import get_similar_concepts
import asyncio


if __name__ == "__main__":
    # point = "The value of work can indeed be assessed by the salary it commands, as higher salaries often reflect the level of skill, expertise, and responsibility required for a job"
    # point = "The value of work cannot be assessed by the salary it commands, as intrinsic factors such as job satisfaction and personal fulfillment play a crucial role in an individual's overall happiness."
    point = "Longer life expectancy creates more problems because it can lead to economic burdens on pension systems and social services, as a larger retired population may outlive their savings and require financial support."
    analyses = asyncio.run(get_similar_results(point, top_k=3))
    concepts = asyncio.run(get_similar_concepts(point, top_k=3))

    print("Similar analyses:")
    for analysis in analyses:
        print(json.dumps(analysis, indent=2))

    print("Similar concepts:")
    for concept in concepts:
        print(json.dumps(concept, indent=2))
