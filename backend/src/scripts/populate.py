from src.scrapers.guardian.get_articles import get_articles
from src.lm.generate_events import generate_events
from src.events.process import add_event_to_db
from src.embeddings.vector_store import store_documents, vector_store

# NOTE: this is for the purpose of populating the database with
# the LM generated events and analyses


def populate():
    # TODO: Query articles from DB
    # NOTE: articles are expected to be in json with all the necessary fields
    articles: list[dict] = get_articles()

    # TODO: Load articles into LM & Generate Events
    # NOTE: events is expected to be in json with all the necessary fields
    # NOTE: so far this part works. To stop having to call the LM API, we can
    # NOTE: save the events to a file and load them from there
    events = generate_events(articles)

    # OPTIONAL: Save events to file
    # with open("events.json", "w") as f:
    #     json.dump(events, f)

    # TODO: Push events to DB
    # if events.json exists
    # with open("events.json", "r") as f:
    #     events = json.load(f)
    for event in events:
        add_event_to_db(event)

    # TODO: Embed analyses and push to pinecone
    store_documents(events)
