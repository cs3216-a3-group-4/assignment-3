import json
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import JsonOutputParser
from typing import List
from pydantic import BaseModel
from src.scrapers.guardian.scrape import query_page
from src.common.constants import LANGCHAIN_API_KEY
from src.common.constants import LANGCHAIN_TRACING_V2
from src.common.constants import OPENAI_API_KEY

import os

os.environ["LANGCHAIN_API_KEY"] = LANGCHAIN_API_KEY
os.environ["LANGCHAIN_TRACING_V2"] = LANGCHAIN_TRACING_V2
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

lm_model = ChatOpenAI(model="gpt-4o-mini")


class CategoryAnalysis(BaseModel):
    category: str
    analysis: str


class EventPublic(BaseModel):
    id: int
    title: str
    description: str
    analysis_list: list[CategoryAnalysis]
    duplicate: bool
    date: str
    is_singapore: bool
    original_article_id: int
    categories: list[str]
    questions: list[str]


class Example(BaseModel):
    event_title: str
    description: str
    questions: list[str]
    analysis_list: list[CategoryAnalysis]
    category: list[str]
    in_singapore: bool
    rating: int


class EventDetails(BaseModel):
    examples: list[Example]


SYSPROMPT = """
    You are a Singaporean student studying for your A Levels. You are curating examples to supplement and bolster your arguments in your General Paper essays.
    Given an article, you should provide relevant examples that can be used to support or refute arguments in a General Paper essay.
    Given the article, you should also generate 2-3 GCE A Level General Paper essay questions that can potentially be answered using the events you have provided.
    You should provide at most 3 example events. If there are no relevant events, you should provide an empty list. You do not have to always provide 3 examples.

    For each event, your title should be specific enough so that I can guess your example without looking at the paragraph.
    For each event, you should categorize your examples into the following categories:
    [Arts & Humanities, Science & Tech, Politics, Media, Environment, Education, Sports, Gender & Equality, Religion, Society & Culture, Economic]
    Important Note: Only categorize an event if the connection to a category is direct, significant, and not merely tangential. Do NOT categorize an event if the connection is speculative or minor.

    For each event, you should give an analysis of how the event can be used in the context of its respective category i.e. the categories that you have chosen for this event.
    The analysis should be specific to the category of the event and should be tailored to the context of General Paper essays. Provide coherent arguments and insights. Be sure to give a detailed analysis of 3-4 sentences.
    In your analysis, you should not mention "General Paper" or "A Levels".
    For the analysis, remember that this is in the context of General Paper which emphasises critical thinking and the ability to construct coherent arguments.
    If needed, you can think about the questions you have generated and how the event can be used to write about points for/against the argument in the question.

    For each event, you should also indicate if the event happened in Singapore. If there is no indication in the article, you should assume that the event did not happen in Singapore.
    For each event, you should also give a rating from 1 to 5 on how useful the event is as an example for a General Paper essay.
    You should give me your examples in the following json format:

    { 
    "examples": [
        { 
        "event_title": "Title of the event",
        "description": "The example that supports or refutes the argument",
        "questions": ["Question 1", "Question 2", "Question 3"],
        "category": "Array of categories for this event. For example ['Arts & Humanities', 'Science & Tech'], 
        "analysis_list": [
            {
            "category": "The category of the event for example 'Arts & Humanities'",
            "analysis": "The analysis of how the example can be used in a General Paper essay for Arts & Humanities"
            },
            {
            "category": "The category of the event for example 'Science & Tech'",
            "analysis": "The analysis of how the example can be used in a General Paper essay for Science & Tech"
            }
        ],
        "in_singapore": "Boolean value to indicate if the event happened in Singapore",
        "rating": "The rating of how useful the event is as an example for a General Paper essay"
        }
        ]
    }

    The article:

"""

sample_text = """
A seething Mikel Arteta admitted that he was “amazed about how inconsistent the decisions can be” after Declan Rice was sent off as Arsenal dropped their first points of the new season against Brighton.

Arsenal had looked on course to maintain their 100% start to the new campaign when Bukayo Saka pounced on a mistake by Lewis Dunk to set up Kai Havertz. But an incident early in the second half when Rice, who had never been sent off before in his career and will now miss the north London derby against Tottenham after the international break, was shown a second yellow card by referee Chris Kavanagh after being deemed to have obstructed Joël Veltman from taking a free-kick altered the momentum of the game entirely.

Arsenal’s Declan Rice is stunned after being shown a second yellow card by the referee Chris Kavanagh
Brighton’s João Pedro pegs back Arsenal for point after Declan Rice sees red
Read more
João Pedro went on to equalise and maintain Brighton’s unbeaten start under Fabian Hürzeler. But Arteta said that he had been stunned by Kavanagh’s decision not to take any action against Veltman for making contact with Rice and with another incident in the first half when Pedro kicked the ball away.

“I was amazed. Amazed, amazed, amazed because of how inconsistent decisions can be,” he said.

“In the first half, there are two incidents and nothing happens.

“Then, in a non-critical area, the ball hits Declan, he turns around, he doesn’t see the player coming and he touches the ball.

“By law, he can make that call, but then by law he needs to make the next call, which is a red card so we play 10 v 10. This is what amazed me. At this level it’s amazing.”

Rice said later he was “shocked … I think you could see that on my face. But this is the laws of the game. If you touch the ball even a little bit it’s a red card after my challenge in the first half. It was tough, it was harsh but I have to move on from it.”

Hürzeler, the 31-year-old who replaced Roberto De Zerbi in the Brighton dugout this summer, felt Kavanagh had made the right decision. “For me it was a clear red card,” he said. “He shoots the ball away – it’s wasting time.”

skip past newsletter promotion
Sign up to Football Daily

Free daily newsletter
Kick off your evenings with the Guardian's take on the world of football

Enter your email address
Sign up
Privacy Notice: Newsletters may contain info about charities, online ads, and content funded by outside parties. For more information see our Privacy Policy. We use Google reCaptcha to protect our website and the Google Privacy Policy and Terms of Service apply.
after newsletter promotion
Arsenal still had an opportunity to take all three points but Havertz and Saka both spurned late opportunities and Arteta’s side now face the prospect of a trip to Tottenham without Rice or new signing Mikel Merino, who injured his shoulder in his first training session this week. “This is what happens. We have to adapt to that context,” said the Arsenal manager.

“That’s why we have other players that can fulfil that [role] and give that opportunity to somebody else.

“But the team reacted to what we had to do playing at home with 10 men. We didn’t want to be so deep defending like this, but we read the game and we played the game that we had to play and we should have got rewarded.”"""

file_path = "data.json"


def get_articles() -> List[str]:
    articles = query_page(1)
    articles = articles[:1]
    return articles


def generate_events() -> List[EventPublic]:
    articles = get_articles()
    res = []
    for article in articles:
        article_body = article.get("fields").get("bodyText")
        event_details = generate_events_from_article(article_body)
        for example in event_details.get("examples"):
            res.append(form_event_json(example))

    with open(file_path, "w") as json_file:
        json.dump(res, json_file, indent=4)
    return res


def form_event_json(event_details) -> dict:
    return EventPublic(
        id=0,
        title=event_details.get("event_title", ""),
        description=event_details.get("description", ""),
        analysis_list=event_details.get("analysis_list", {}),
        duplicate=False,
        date="",
        is_singapore=event_details.get("in_singapore", False),
        categories=event_details.get("category", []),
        original_article_id=0,
        questions=event_details.get("questions", []),
    ).model_dump()


"""
Generate a batch of prompts for OpenAI Batch API to generate events from articles
"""


def generate_batch_prompts() -> List[str]:
    articles = get_articles()
    batch_prompts = []
    id = 0
    for article in articles:
        request_id = f"request_{id}"
        id += 1
        batch_prompts.append(
            {
                "custom_id": request_id,
                "method": "POST",
                "url": "/v1/chat/completions",
                "body": {
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": SYSPROMPT},
                        {
                            "role": "user",
                            "content": article.get("fields").get("bodyText"),
                        },
                    ],
                    # "metadata": {
                    #     "article_id": f"article_{id}",
                    # },
                    "max_tokens": 1000,
                },
            }
        )

    with open("batch_prompts.jsonl", "w") as jsonl_file:
        for item in batch_prompts:
            jsonl_file.write(json.dumps(item) + "\n")


def generate_events_from_article(article: str) -> dict:
    messages = [SystemMessage(content=SYSPROMPT), HumanMessage(content=article)]

    result = lm_model.invoke(messages)
    parser = JsonOutputParser(pydantic_object=EventDetails)
    events = parser.invoke(result)
    return events


if __name__ == "__main__":
    generate_batch_prompts()
