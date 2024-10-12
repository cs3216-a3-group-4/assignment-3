from typing import List
from pydantic import BaseModel
from src.lm.lm import lm_model_essay as lm_model

from langchain_core.output_parsers import JsonOutputParser
from langchain_core.messages import HumanMessage, SystemMessage
from src.lm.essay_grader_prompts import GRADER_SYSPROMPT as SYSPROMPT
from src.lm.essay_grader_prompts import GRADER_HUMAN_PROMPT as HUMAN_PROMPT

from src.essays.models import Comment, CommentParentType, Inclination


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
    print(result.content)
    parser = JsonOutputParser(pydantic_object=Comments)
    comments = parser.invoke(result.content)
    return comments


def generate_comment_orm(comments: dict):
    comment_list = comments.get("comments")
    orm_list = []
    for comment in comment_list:
        inclination = comment.get("inclination")
        content = comment.get("comment")
        lacking_examples = True if comment.get("lacking_examples") == "Yes" else False

        orm = Comment(
            inclination=inclination,
            content=content,
            lack_example=lacking_examples,
            parent_type=CommentParentType.PARAGRAPH,
        )
        orm_list.append(orm)

    return orm_list


def get_comments(content: str, question: str):
    comments = generate_paragraph_comments(content, question)
    comment_orm = generate_comment_orm(comments)
    return comment_orm


if __name__ == "__main__":
    content = "Moreover, by providing aid to different beneficiaries, charitable giving is seen as a desirable way to develop empathy and compassion in us. In the long-run, it may even be part of governmental aims to build the ‘heartware’ of societies through whole-of-society approaches, by implementing policies, community infrastructure and services. Countries such as Singapore have embarked on public education campaigns to imbue these values from a young age. The ‘Singapore Kindness Movement’ (SKF), for example, aims to help build a gracious Singapore, by encouraging individuals to internalise courtesy, kindness and consideration. In the Seed Kindness Fund, SKF supports kindness community projects by youths aged 14–26 years old with up to $1,000 funding per project. It provides invaluable opportunities for youths to take ownership of their contributions to the community through Values In Action (VIA) projects such as fundraising or volunteering initiatives. Besides, at an individual level, charitable giving is also seen as a meaningful way to contribute to the community while broadening one’s perspectives. Voluntourism, for instance, offers tourist volunteers an emotionally charged experience by alleviating poverty at places such as Cambodia and Guatemala. These include teaching the young or building basic amenities for some impoverished families in these countries. Therefore, charitable giving is desirable as it provides avenues for us to invest time, effort or money in causes we deeply resonate in and find significant fulfillment and purpose amidst the hustle and bustle of our everyday lives."
    question = "To what extent is charitable giving desirable?"
    comments = generate_paragraph_comments(content, question)
    print("Comments\n", comments)
    comment_orm = generate_comment_orm(comments)
    print(comment_orm[0].content)
