from src.user_questions.models import Answer, Fallback, Point, PointAnalysis
from src.lm.dict_types import PointsAfterLLMType


def form_answer_analysis_based(answer: Answer, results: PointsAfterLLMType) -> Answer:
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
