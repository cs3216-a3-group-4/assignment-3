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
GOOGLE_REDIRECT_URI = _get_env_var("GOOGLE_REDIRECT_URI")
