import asyncio
from typing import List
from pydantic import BaseModel
from src.lm.lm import lm_model_essay as lm_model

from langchain_core.output_parsers import JsonOutputParser
from langchain_core.messages import HumanMessage, SystemMessage
from src.lm.essay_grader_prompts import GRADER_SYSPROMPT as SYSPROMPT
from src.lm.essay_grader_prompts import (
    WHOLE_ESSAY_GRADER_HUMAN_PROMPT as ESSAY_HUMAN_PROMPT,
    WHOLE_ESSAY_GRADER_SYSPROMPT as ESSAY_SYSPROMPT,
)
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


def generate_comment_orm(
    comments: dict,
    content: str,
    question: str,
    parent_type: CommentParentType = CommentParentType.PARAGRAPH,
):
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
            parent_type=parent_type,
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


def generate_essay_comments(paragraphs: list[str], question: str):
    essay = form_essay(paragraphs)
    prompt = f"""
    Question: {question}
    Essay: {essay}
    """

    print("Prompt: ", prompt)

    human_message = ESSAY_HUMAN_PROMPT + prompt
    messages = [
        SystemMessage(content=ESSAY_SYSPROMPT),
        HumanMessage(content=human_message),
    ]

    result = lm_model.invoke(messages)
    parser = JsonOutputParser(pydantic_object=Comments)
    comments = parser.invoke(result.content)
    return comments


def get_essay_comments(paragraphs: list[str], question: str):
    comments = generate_essay_comments(paragraphs, question)
    comment_orm = generate_comment_orm(
        comments, paragraphs, question, CommentParentType.ESSAY
    )
    return comment_orm


def form_essay(paragraphs: list[str]):
    essay = ""
    for paragraph in paragraphs:
        essay += paragraph + "\n"
    return essay


if __name__ == "__main__":
    paragraphs = [
        "The President of the United States has been long recognised by many as the most influential figure in the world. Yet, quite ironically, the constant love-hate feud between the incumbent President Donald Trump and social media has prompted many to question the dynamics between politicians and social media, perhaps even insinuating that the power of politicians today have diminished due to the emergence of social media platforms that today dictate much of the social discourse, and that has seeped into every aspect imaginable of everyday life. While the influence of social media certainly cannot be dismissed, I do not fully agree that social media has more influence than politicians as the issue is much more nuanced and complexed. Instead, I believe that while at the individual scale, social media may be more influential in shifting mindsets, politicians and social media are rather, mutually reinforcing in influencing social changes and political decisions at the national, and global scale.",
        "At the individual scale, it is hard to deny that social media has more influence on the common man than politicians. Social media has lent us each a voice and a platform to be heard- bringing together virtual communities and providing us a means to engage closely without others at the tip of our fingers. This engagement has birthed a ‘ground-up’ approach of influencing the way we think, how we communicate with others, and how we perceive our roles and duties as citizens of the world, more so than the top-down directive politicians often take. For instance, awareness towards the need for more sustainable lifestyle habits had skyrocketed thanks to lifestyle gurus who advocated for these causes using social media- this particularly resonated with the common man as it establishes a personable connection to these ‘influencers’ which appealed to them. It is no wonder that one would be expected to be well familiar with online personalities- such as “Pewdiepie” “Mr Beast” , , and “Charli D'Amelio” , but forgiven for not knowing many politicians: shockingly, one in three Americans do not know the Governor of their state. Hence, as opposed to the impersonal and distant image portrayed by politicians, social media provides a ‘bottom-up’ engagement that significantly appeals to and thus, can establish a deeper connection, to and hence, influence us at the individual level more so than politicians.",
        "However, simply concluding that social media is more influential than politicians solely based on the impact it has at the individualistic level would be too narrow a view. Some may argue that social media has a greater influence in shaping social change and it is not difficult to understand why. After all, social causes like #MeT oo, BlackLivesMatter and HeforShe have all been born from social media platforms like Instagram and it is these online activists who are leading the fight towards a more progressive society. However, I believe that this is often too sweeping an argument to assert- while social media has been crucial to the fight towards social change, the influence of politicians cannot be dismissed. With the nature of the internet and its ‘short-attention span’ , online movements and causes often meet their inevitable ‘death’ and fizzle out from the interest of netizens. Here, politicians need to step in as they can enact concrete, and permanent legislation, policies and structures that are essential to bring about change, which social media cannot do. Hence, the relationship between politicians and social media becomes intertwined and they both need to work together to bring about any change in society- implying that not, one, but both are equally influential given the symbiotic relationship they share. Essentially, social media that can provide the marginalised a voice, acts as the ‘vessel’ that helps activists reach out to the wider community and governments who can then implement policies and laws to bring about concrete change.",
        "Furthermore, in the political realm, while it may appear straightforwardly true that politicians would have the larger influence in politics, I believe that social media also has an equally heavy influence on politics. Certainly, politicians are ultimately the ones with vested power to make political decisions, and can do so without regard for social media influences. For instance, Brazilian president, Jair Bolsano has been the forefront of heavy criticism for recklessly accelerating the deforestation of the Amazon and ignoring the medical advice of doctors in his handling of the COVID-19 pandemic on social media platforms like Twitter, Facebook and Instagram. Yet, has continued on, and disregarded these remarks- highlighting how it may seem that political decisions are largely influenced by politicians rather than social media. However, I believe that social media still has an undeniable influence on politics, especially when it comes to elections. Going back to the earlier example, where it may have seem that social media has little influence on political developments, it should also be pointed out how social media had been weaponized by the then-presidential candidate Jair Bolzano who had benefited from a powerful and coordinated disinformation campaign, deliberately aimed to discredit his rivals by blasting an onslaught doctored images and manipulated audio clips via social media platforms which experts point to be a key factor to his success at the polls. This observation is not anomalous, but is part of a trend that sees social media heavily influencing electoral results, and how politicians behave- often tapping on social media outlets to connect with their electorate that would allow them to entrench their power, and attract greater support. The “online” pandemic elections in Singapore is also testament to this, where political powerhouse the People’s Action Party (PAP) saw one of their worst showings at the polls, partly because of their failure to capitalise on social media as well as their oppositions did, like the Worker’s Party and Progress Singapore Party (PSP) who engaged well with the online netizens. Hence, this highlights that though it may appear that politicians may be more influential in the political sphere due to their power in setting laws, and regulations, social media is also equally influential due to their immense leverage it has over electoral results, and has also affected the way politicians govern.",
    ]
    question = "To what extent do you agree that social media has more influence than politicians?"

    comments = generate_essay_comments(paragraphs, question)
    print(comments)
