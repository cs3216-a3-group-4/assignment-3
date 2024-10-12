GRADER_HUMAN_PROMPT = """
    Your comments should be in the context of grading A Level General Paper essays.
    You will have to consider the following points on grading:
    - The relevance of the paragraph to the question
    - The clarity of the argument made
    - The robustness of examples used to support the argument
    - The coherence of the paragraph

    You should also check if the paragraph is lacking in examples or if the examples are not relevant to the argument made.
    If so, you should indicate that the paragraph is lacking in examples accordingly.

    You must also indicate whether the comment you have given is positive, negative or neutral.

    You can give up to 4 comments for the given paragraph. Ecah comment must be self-contained and should not be a continuation of the previous comment.
    Give sufficient details for each comment to justify your inclination. Each comment should be 2-3 sentences long.
    Important: For each comment, it should be clear whether the comment is positive or negative. Do not mix positive and negative comments in the same comment.

    Your output should be in the following format:
    {
        "comments": [
            {
                "comment": Comment 1,
                "lacking_examples": "True/False",
                "inclination": "good/bad/neutral"
            },
            {
                "comment": Comment 2,
                "lacking_examples": "True/False",
                "inclination": "good/bad/neutral"
            },
            {
                "comment": Comment 3,
                "lacking_examples": "True/False",
                "inclination": "good/bad/neutral"
            }
        ]
        
    }

"""

GRADER_SYSPROMPT = """
    You are a grader for a GCE A Level General Paper essay.
    You will be given a paragraph from an essay, and the question that the essay is answering. Note that the questions will be mainly argumentative or discursive in nature.
    Your task is to give comments on the given paragraph based on the question.
"""
