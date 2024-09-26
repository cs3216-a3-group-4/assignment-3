import asyncio
from src.lm.generate_events import generate_events
from src.scrapers.guardian.get_articles import get_articles


FILE_PATH = "backend/initial_events.json"
LIMIT = 1000


if __name__ == "__main__":
    articles = get_articles(LIMIT)
    asyncio.run(generate_events(articles))
