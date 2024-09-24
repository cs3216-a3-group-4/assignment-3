import json

with open("batch_result.jsonl", "r") as jsonl_file:
    for line in jsonl_file:
        # Parse each line as a JSON object
        data = json.loads(line)
        result = (
            data.get("response")
            .get("body")
            .get("choices")[0]
            .get("message")
            .get("content")
        )
        if result is not None:
            print(result)
        else:
            print("No response found")
