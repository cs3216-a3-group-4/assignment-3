from src.user_questions.models import (
    Answer,
    Fallback,
    Point,
    PointAnalysis,
    PointArticleConcept,
)
from src.lm.dict_types import (
    PointsAfterLLMType,
    PointsWithConceptsAfterLLMType,
    PointWithConceptsAndLLMType,
)


def form_point_concept_based(row: PointWithConceptsAndLLMType, positive: bool):
    point = row["point"]
    concepts = row["concepts"]
    point = Point(title=point, body="", positive=positive)

    for concept in concepts:
        point.point_article_concepts.append(
            PointArticleConcept(
                concept_id=concept["concept_id"],
                article_id=concept["article_id"],
                elaboration=concept["elaborations"],
            )
        )
    return point


def form_answer_concept_based(results: PointsWithConceptsAfterLLMType) -> Answer:
    """
    Given an answer and the results of the LLM, returns an Answer data type
    """
    answer = Answer()
    for row in results["for_points"]:
        point = form_point_concept_based(row, True)
        answer.points.append(point)

    for row in results["against_points"]:
        point = form_point_concept_based(row, False)
        answer.points.append(point)

    return answer


def form_answer_analysis_based(results: PointsAfterLLMType) -> Answer:
    """
    Given an answer and the results of the LLM, returns an Answer data type
    """
    answer = Answer()
    for row in results["for_points"]:
        point = row["point"]
        analyses = row["analyses"]
        point = Point(title=point, body="", positive=True)

        for analysis in analyses:
            point.point_analysises.append(
                PointAnalysis(
                    elaboration=analysis["elaborations"],
                    analysis_id=analysis["id"],
                )
            )
        if not analyses:
            point.fallback = Fallback(
                alt_approach=row["fall_back_response"]["alt_approach"],
                general_argument=row["fall_back_response"]["general_argument"],
            )
        answer.points.append(point)

    for row in results["against_points"]:
        point = row["point"]
        analyses = row["analyses"]
        point = Point(title=point, body="", positive=False)
        for analysis in analyses:
            point.point_analysises.append(
                PointAnalysis(
                    elaboration=analysis["elaborations"],
                    analysis_id=analysis["id"],
                )
            )
        if not analyses:
            point.fallback = Fallback(
                alt_approach=row["fall_back_response"]["alt_approach"],
                general_argument=row["fall_back_response"]["general_argument"],
            )
        answer.points.append(point)

    return answer
