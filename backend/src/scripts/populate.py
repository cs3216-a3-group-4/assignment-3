import json
from src.events.process import add_event_to_db
from src.embeddings.vector_store import store_documents
from src.events.process import EventLLM

# NOTE: this is for the purpose of populating the database with
# the LM generated events and analyses


def populate():
    # TODO: Query articles from DB
    # NOTE: articles are expected to be in json with all the necessary fields

    with open("backend/lm_events_output.json", "r") as f:
        events = json.load(f)
    for event in events:
        event_obj = EventLLM(
            title=event.get("title"),
            description=event.get("description"),
            analysis_list=event.get("analysis_list"),
            duplicate=event.get("duplicate"),
            is_singapore=event.get("is_singapore"),
            original_article_id=event.get("original_article_id"),
            rating=int(event.get("rating", "0")),
        )
        add_event_to_db(event_obj)

    # TODO: Embed analyses and push to pinecone
    store_documents(events)


if __name__ == "__main__":
    populate()
