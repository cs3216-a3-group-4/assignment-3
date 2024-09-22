import os

from dotenv import load_dotenv

load_dotenv()


def _get_env_var(name: str, default: str | None = None, required: bool = True):
    value = os.getenv(name, default)
    if (value is None) and required:
        raise ValueError(f"{name} environment variable not defined")
    return value


DATABASE_URL: str = _get_env_var("DATABASE_URL")
SECRET_KEY: str = _get_env_var("SECRET_KEY", "", required=False)
FRONTEND_URL: str = _get_env_var("FRONTEND_URL", required=False)
GOOGLE_CLIENT_ID: str = _get_env_var("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET: str = _get_env_var("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI: str = _get_env_var("GOOGLE_REDIRECT_URI")
LANGCHAIN_TRACING_V2: str = _get_env_var("LANGCHAIN_TRACING_V2")
LANGCHAIN_API_KEY: str = _get_env_var("LANGCHAIN_API_KEY")
OPENAI_API_KEY: str = _get_env_var("OPENAI_API_KEY")
PINECONE_API_KEY: str = _get_env_var("PINECONE_API_KEY")

# for scrapers
GUARDIAN_API_KEY: str = _get_env_var("GUARDIAN_API_KEY", required=False)
