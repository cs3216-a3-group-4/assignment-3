import asyncio
from typing import List
from pydantic import BaseModel
from src.lm.lm import lm_model_essay as lm_model

from langchain_core.output_parsers import JsonOutputParser
from langchain_core.messages import HumanMessage, SystemMessage
from src.lm.essay_grader_prompts import GRADER_SYSPROMPT as SYSPROMPT
from src.lm.essay_grader_prompts import GRADER_HUMAN_PROMPT as HUMAN_PROMPT
from src.lm.essay_grader_prompts import (
    POINT_EXTRACTION_PROMPT as POINT_EXTRACTION_PROMPT,
)
from src.embeddings.vector_store import get_similar_results

from src.essays.models import Comment, CommentAnalysis, CommentParentType, Inclination


class LMComment(BaseModel):
    comment: str
    inclination: Inclination
    lacking_examples: bool


class Comments(BaseModel):
    comments: List[LMComment]


def generate_paragraph_comments(content: str, question: str):
    prompt = f"""
    Question: {question}
    Paragraph: {content}
    """

    human_message = HUMAN_PROMPT + prompt
    messages = [SystemMessage(content=SYSPROMPT), HumanMessage(content=human_message)]

    result = lm_model.invoke(messages)
    parser = JsonOutputParser(pydantic_object=Comments)
    comments = parser.invoke(result.content)
    print("COMMENT: ", comments)
    return comments


def generate_comment_orm(comments: dict, content: str, question: str):
    comment_list = comments.get("comments")
    orm_list = []
    for comment in comment_list:
        inclination = comment.get("inclination")
        content = comment.get("comment")
        lacking_examples = True if comment.get("lacking_examples") == "True" else False

        orm = Comment(
            inclination=inclination,
            content=content,
            lack_example=lacking_examples,
            parent_type=CommentParentType.PARAGRAPH,
        )
        if lacking_examples:
            print("Caught lacking")
            examples = asyncio.run(generate_comment_with_example(content, question))
            orm.comment_analysises.append(
                CommentAnalysis(
                    skill_issue=examples[0].get("content"),
                    analysis_id=examples[0].get("id"),
                )
            )
        orm_list.append(orm)

    return orm_list


def extract_point(content: str, question: str):
    prompt = f"""
    Question: {question}
    Paragraph: {content}
    """

    human_message = POINT_EXTRACTION_PROMPT + prompt
    messages = [SystemMessage(content=SYSPROMPT), HumanMessage(content=human_message)]

    result = lm_model.invoke(messages)
    parser = JsonOutputParser()
    points = parser.invoke(result.content)
    return points["argument"]


async def generate_comment_with_example(content: str, question: str):
    """
    Generate comments for a paragraph with bad examples
    """
    argument = extract_point(content, question)
    examples = await get_similar_results(argument, top_k=1)

    return examples


def get_comments(content: str, question: str):
    comments = generate_paragraph_comments(content, question)
    comment_orm = generate_comment_orm(comments, content, question)
    return comment_orm


if __name__ == "__main__":
    content = "Moreover, by providing aid to different beneficiaries, charitable giving is seen as a desirable way to develop empathy and compassion in us. In the long-run, it may even be part of governmental aims to build the ‘heartware’ of societies through whole-of-society approaches, by implementing policies, community infrastructure and services. Many charities help people and this incorporates empathy in us, therefore it is desirable."
    question = "To what extent is charitable giving desirable?"
    comment_orm = get_comments(content, question)
    for comment in comment_orm:
        print(comment.comment_analysises)
        print("\n")
