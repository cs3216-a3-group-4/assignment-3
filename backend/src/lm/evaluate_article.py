import asyncio
from src.lm.lm import lm_model
from src.lm.prompts import FILTER_USELESS_ARTICLES_SYSPROMPT as SYSPROMPT

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import JsonOutputParser


async def check_article_title(title: str) -> bool:
    """Return true if the article is useful."""
    retry_attempts = 3
    for _ in range(retry_attempts):
        try:
            messages = [
                SystemMessage(content=SYSPROMPT),
                HumanMessage(content=title),
            ]

            result = await lm_model.ainvoke(messages)
            parser = JsonOutputParser()
            response = parser.invoke(result)
            useful = True if response.get("useful", "True") == "True" else False
            return useful
        except asyncio.CancelledError as e:
            print(e)
            return True
        except Exception as e:  # noqa: E722
            print(e)
            print("hit the rate limit! waiting 10s for article", title)
            await asyncio.sleep(10)

    # give up and dont filter
    return True


async def main():
    result = await check_article_title(input("Enter article title:"))
    print("Useful:", result)


if __name__ == "__main__":
    # Hello, reader.
    # If you are here to test check_article_title, you can print the response variable
    # to see the explanation of why the LLM thinks x article is invalid.
    asyncio.run(main())
