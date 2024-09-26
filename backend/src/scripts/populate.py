import json
from src.events.process import add_event_to_db
from src.events.process import EventLLM


# Populate the db with events from lm_events_output.json
def populate() -> list[int]:
    ids = []
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
        success, id = add_event_to_db(event_obj)
        if success:
            ids.append(id)
    return ids
