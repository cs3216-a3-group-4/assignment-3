import json
from src.events.process import add_event_to_db
from src.events.process import EventLLM
from src.embeddings.vector_store import store_documents


# Populate the db with events from lm_events_output.json
def populate():
    with open("lm_events_output.json", "r") as f:
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


def set_up():
    # add events + analyses to db
    populate()
    # store analyses in vector store
    store_documents()


if __name__ == "__main__":
    set_up()
