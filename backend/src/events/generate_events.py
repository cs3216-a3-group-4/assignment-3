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

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import JsonOutputParser

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


class Example(BaseModel):
    event_title: str
    description: str
    analysis_list: list[CategoryAnalysis]
    category: list[str]
    in_singapore: bool
    rating: int


class EventDetails(BaseModel):
    examples: list[Example]


# SYSPROMPT = """
# You are a helpful student assistant helping students find examples for their A Level general paper to substantiate their arguments in their essays.
# Given an article, you should provide examples that can be used to support or refute arguments in a General Paper essay.
# You should only provide at most 3 examples.
# For each event, your titles should be specific enough so that I can guess your example without looking at the paragraph.
# For each event, you should also categorize your examples into the following categories:
# [ Arts & Humanities, Science & Tech, Politics, Media, Environment, Education, Sports, Gender & Equality, Religion, Society & Culture, Economic]
# For each event, you should also indicate if the event happened in Singapore. If there is no indication in the article, you should assume that the event did not happen in Singapore.
# You should give me your examples in the following json format.

# { 
# "examples": [
#     { 
#     "event_title": "Title of the event",
#     "description": "The example that supports or refutes the argument", 
#     "analysis": "The analysis of how the example can be used in a General Paper essay" },
#     "category": "Array of categories. For example ['Arts & Humanities', 'Science & Tech'],
#     "in_singapore": "Boolean value to indicate if the event happened in Singapore"
#     },
#     { 
#     "event_title": "Title of the event",
#     "description": "The example that supports or refutes the argument", 
#     "analysis": "The analysis of how the example can be used in a General Paper essay" },
#     "category": "Array of categories. For example ['Arts & Humanities', 'Science & Tech'],
#     "in_singapore": "Boolean value to indicate if the event happened in Singapore"
#     }
#     ]
# }
# """

SYSPROMPT = """
    You are a helpful assistant helping students find examples for their A Level general paper to substantiate their arguments in their essays.
    Given an article, you should provide examples that can be used to support or refute arguments in a General Paper essay.
    You should provide at most 3 example events. If there are no relevant events, you should provide an empty list. You do not have to always provide 3 examples.

    For each event, your title should be specific enough so that I can guess your example without looking at the paragraph.
    For each event, you should categorize your examples into the following categories:
    [Arts & Humanities, Science & Tech, Politics, Media, Environment, Education, Sports, Gender & Equality, Religion, Society & Culture, Economic]
    Important Note: Only categorize an event if the connection to a category is direct, significant, and not merely tangential. Do NOT categorize an event if the connection is speculative or minor.

    For each event, you should give an analysis of how the event can be used in the context of its respective category.
    The analysis should be specific to the category of the event and should be detailed enough to be used in a General Paper essay. Limit your analysis to 3 sentences.
    For each event, you should also indicate if the event happened in Singapore. If there is no indication in the article, you should assume that the event did not happen in Singapore.
    For each event, you should also give a rating from 1 to 5 on how useful the event is as an example for a General Paper essay.
    You should give me your examples in the following json format:

    { 
    "examples": [
        { 
        "event_title": "Title of the event",
        "description": "The example that supports or refutes the argument",
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

def generate_events() -> List[EventPublic]:
    # articles = query_page(1)
    # articles = articles[:1]
    articles = [sample_text]
    res = []
    for article in articles:
        # article_body = article.get("fields").get("bodyText")
        article_body = article
        event_details = generate_events_from_article(article_body)
        for example in event_details.get("examples"):
            res.append(form_event_json(example))

    return res;


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
        original_article_id=0
    )


def generate_events_from_article(article: str) -> dict:
    messages = [
        SystemMessage(content=SYSPROMPT),
        HumanMessage(content=article)
    ]

    result = lm_model.invoke(messages);
    parser = JsonOutputParser(pydantic_object=EventDetails)
    events = parser.invoke(result)
    return events

if __name__ == "__main__":
    print(generate_events())



