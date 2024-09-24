from datetime import timedelta

from fastapi import Response
from src.auth.dependencies import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token
from src.auth.models import User
from src.auth.schemas import Token, UserPublic
from src.common.constants import FRONTEND_URL
from src.utils.mail import send_email


def create_token(user: User, response: Response):
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )

    response.set_cookie(key="session", value=access_token)
    return Token(  # noqa: F821
        access_token=access_token,
        token_type="bearer",
        user=UserPublic.model_validate(user),
    )


def send_reset_password_email(email: str, code: str):
    send_email(
        email,
        "Reset your password",
        f"Here is the link to reset your password.\n{FRONTEND_URL}/reset-password?code={code}",
    )
