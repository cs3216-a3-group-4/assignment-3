from src.lm.prompts import SYSPROMPT
from typing import List


def generate_batch_prompts() -> List[str]:
    articles = get_articles()
    batch_prompts = []
    id = 0
    for article in articles:
        request_id = f"request_{id}"
        id += 1
        batch_prompts.append(
            {
                "custom_id": request_id,
                "method": "POST",
                "url": "/v1/chat/completions",
                "body": {
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": SYSPROMPT},
                        {
                            "role": "user",
                            "content": article.get("fields").get("bodyText"),
                        },
                    ],
                    # "metadata": {
                    #     "article_id": f"article_{id}",
                    # },
                    "max_tokens": 1000,
                },
            }
        )

    with open("batch_prompts.jsonl", "w") as jsonl_file:
        for item in batch_prompts:
            jsonl_file.write(json.dumps(item) + "\n")
