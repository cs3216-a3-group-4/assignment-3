import httpx
import json
import argparse
import time

from src.common.constants import GUARDIAN_API_KEY


def query_page(page: int):
    response = httpx.get(
        "https://content.guardianapis.com/search",
        params={
            "api-key": GUARDIAN_API_KEY,
            "page-size": 50,
            "page": page,
            "lang": "en",
            "show-fields": ["all"],
        },
    )
    response_json = response.json()
    data = response_json["response"]
    if data["status"] != "ok":
        print("something went wrong with page:", page)
        return []
    return data["results"]


parser = argparse.ArgumentParser()
parser.add_argument("-o", "--output", help="output file path")
parser.add_argument("-s", "--start", type=int, help="start index of page", default=0)
parser.add_argument("-n", "--number", type=int, help="number of pages", default=50)
args = parser.parse_args()

result = []
for i in range(args.start, args.start + args.number):
    result += query_page(i)
    print("scraped:", i)
    time.sleep(1)

with open(args.output, "w") as f:
    json.dump(result, f)
