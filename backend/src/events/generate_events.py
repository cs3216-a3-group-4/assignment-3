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

SYSPROMPT = """
You are a helpful student assistant helping students find examples for their A Level general paper to substantiate their arguments in their essays.
Given an article, you should provide examples that can be used to support or refute arguments in a General Paper essay.
You should only provide at most 3 examples.
For each event, your titles should be specific enough so that I can guess your example without looking at the paragraph.
For each event, you should also categorize your examples into the following categories:
[ Arts & Humanities, Science & Tech, Politics, Media, Environment, Education, Sports, Gender & Equality, Religion, Society & Culture, Economic]
For each event, you should also indicate if the event happened in Singapore. If there is no indication in the article, you should assume that the event did not happen in Singapore.
You should give me your examples in the following json format.

{ 
"examples": [
    { 
    "event_title": "Title of the event",
    "description": "The example that supports or refutes the argument", 
    "analysis": "The analysis of how the example can be used in a General Paper essay" },
    "category": "Array of categories. For example ['Arts & Humanities', 'Science & Tech'],
    "in_singapore": "Boolean value to indicate if the event happened in Singapore"
    },
    { 
    "event_title": "Title of the event",
    "description": "The example that supports or refutes the argument", 
    "analysis": "The analysis of how the example can be used in a General Paper essay" },
    "category": "Array of categories. For example ['Arts & Humanities', 'Science & Tech'],
    "in_singapore": "Boolean value to indicate if the event happened in Singapore"
    }
    ]
}

"""

def generate_events():
    articles = query_page(1)
    articles = articles[:1]
    res = []
    for article in articles:
        article_body = article.get("fields").get("bodyText")
        event_details = generate_events_from_article(article_body)
        for example in event_details.get("examples"):
            res.append(form_event_json(example))

    return res;



        
def form_event_json(event_details) -> dict:
    return EventPublic(
        id=0,
        title=event_details.get("event_title", ""),
        description=event_details.get("description", ""),
        analysis=event_details.get("analysis", ""),
        duplicate=False,
        date="",
        is_singapore=event_details.get("in_singapore", False),
        categories=event_details.get("category", []),
        original_article_id=0
    )



    
class EventPublic(BaseModel):
    id: int
    title: str
    description: str
    analysis: str
    duplicate: bool
    date: str
    is_singapore: bool
    original_article_id: int
    categories: list[str]


class Example(BaseModel):
    event_title: str
    description: str
    analysis: str
    category: list[str]
    in_singapore: bool


class EventDetails(BaseModel):
    examples: list[Example]


def generate_events_from_article(article: str) -> dict:
    messages = [
        SystemMessage(content=SYSPROMPT),
        HumanMessage(content=article)
    ]

    result = lm_model.invoke(messages);
    parser = JsonOutputParser(pydantic_object=EventDetails)
    events = parser.invoke(result)
    print(events)
    return events

# if __name__ == "__main__":
#     generate_events()



