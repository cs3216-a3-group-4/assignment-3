import json

with open("./src/scrapers/guardian/data.json") as f:
    data = json.load(f)

print(len(data))
