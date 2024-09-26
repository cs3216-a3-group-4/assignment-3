from datetime import datetime
from bs4 import BeautifulSoup
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.common.database import engine
import httpx
import random
import json
import asyncio

from src.events.models import Article


def get_url(category_slug: str, page: int):
    return f"https://www.channelnewsasia.com/api/v1/infinitelisting/{category_slug}?_format=json&viewMode=infinite_scroll_listing&page={page}"


CATEGORIES = {
    "Asia": "1da7e932-70b3-4a2e-891f-88f7dd72c9d6",
    "East Asia": "1da7e932-70b3-4a2e-891f-88f7dd72c9d6",
    "Singapore": "94f7cd75-c28b-4c0a-8d21-09c6ba3dd3fc",
    "World": "9f7462b9-d170-42c1-a26c-5f89720ff5c9",
    "Commentary": "f8f0f8b1-004c-486f-ac72-0c927b7b539d",
    "CNA Explains": "606c3c40-80d4-40e6-8577-eff478dddfbf",
    "Business": "5207efc4-baf1-47a8-a6d3-47a940cc115c",
    "Sport": "da22669b-311e-4347-8bd9-6cdbcec9c380",
    "CNA Insider": "18e56af5-db43-434c-b76b-8c7a766235ef",
    # Sustainability section does not have a view more button in CNA
}

with Session(engine) as session:
    urls = set(session.scalars(select(Article.url)))


async def scrape(category: str, pages: int = 10, start_date: datetime = None):
    slug = CATEGORIES[category]
    with open(f"./src/scrapers/cna/data/{category}.json") as f:
        data = json.load(f)
    error_count = 0
    async with httpx.AsyncClient() as client:
        for i in range(pages):
            url = get_url(slug, i)
            try:
                resp = (await client.get(url)).json()
                result = resp["result"]
                terminate = False
                if start_date:
                    result = [
                        row
                        for row in result
                        if datetime.fromisoformat(row["date"].split("T")[0])
                        >= start_date
                    ]
                    if len(result) != len(resp["result"]):
                        terminate = True
                    # eliminate duplicates
                    result = [row for row in result if row["absolute_url"] not in urls]
                data.append(result)
                if terminate:
                    print("Reached end of date limit", i, category)
                    break
                await asyncio.sleep(3 + (4 * random.random()))
                # save every 10 pages in case something bad happens
                error_count = 0
                if i % 10 == 0:
                    print(f"{category}: {i}")
                    with open(f"./src/scrapers/cna/data/{category}.json", "w") as f:
                        json.dump(data, f)
            except Exception as e:  # noqa: E722
                print(e)
                print(
                    f"Something went wrong for {category}, {i}. Might have ran out of pages."
                )
                print(url)
                error_count += 1
                if error_count == 10:
                    # out of pages? failed for 10 consecutive attempts
                    print(f"Terminated - {category}")
                    return

    with open(f"./src/scrapers/cna/data/{category}.json", "w") as f:
        json.dump(data, f)


async def scrape_index(start_date: datetime = None):
    await asyncio.gather(
        *[scrape(category, 200, start_date) for category in CATEGORIES]
    )


async def scrape_single_page(url):
    resp = httpx.get(url, follow_redirects=True)
    soup = BeautifulSoup(resp.content, features="html.parser")

    content = []
    divs = soup.select(
        ".layout__region--first .content-wrapper:not(:has(.referenced-card)):not(:has(.figure__caption))"
    )
    for div in divs:
        content.append(div.get_text())
    return "".join(content)


scraped_slugs = set()


async def scrape_category(category: str, start_date: datetime = None):
    with open(f"./src/scrapers/cna/data/{category}.json") as f:
        data = json.load(f)
    skipped = 0

    for index, page in enumerate(data):
        for item in page:
            if item["type"] != "article":
                continue
            date = item["date"]
            if start_date and datetime.fromisoformat(date.split("T")[0]) < start_date:
                continue
            try:
                absolute_url = item["absolute_url"]
                if absolute_url in scraped_slugs:
                    skipped += 1
                    print(f"skipped: {skipped}")
                    continue
                content = await scrape_single_page(absolute_url)
                with open(
                    f"./src/scrapers/cna/articles/{item['uuid']}_{category}.txt", "w"
                ) as f:
                    f.write(content)
                await asyncio.sleep(1 + 2 * random.random())
            except:  # noqa: E722
                pass
        print(f"scraped: {category}, {index}(x10)")


async def scrape_all_categories(start_date: datetime = None):
    await asyncio.gather(
        *[scrape_category(category, start_date=start_date) for category in CATEGORIES]
    )


async def scrape_from_date(start_date: datetime):
    await scrape_index(start_date=start_date)
    await scrape_all_categories(start_date=start_date)


if __name__ == "__main__":
    asyncio.run(scrape_from_date(start_date=datetime(2024, 9, 20)))
