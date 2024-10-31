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


def send_verification_email(receiving_email_addr: str, verification_link: str):
    subject = "Verify Your Email for Jippy ✨"
    plain_message = (
        "Hi there,\n\n"
        "Thank you for signing up for Jippy! Please verify your email by clicking the link below:\n"
        f"{verification_link}\n\n"
        "If you didn't sign up, please ignore this email.\n\n"
        "Best,\nThe Jippy Team"
    )

    # HTML message with a button
    html_message = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Welcome to Jippy!</h2>
        <p>Thanks for signing up. Click the button below to verify your email address:</p>
        <a href="{verification_link}" 
           style="
             display: inline-block;
             padding: 10px 20px;
             font-size: 16px;
             color: white;
             background-color: #4CAF50;
             text-decoration: none;
             border-radius: 5px;
           ">
           Verify My Email
        </a>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p><a href="{verification_link}">{verification_link}</a></p>
        <p>If you didn't sign up, please ignore this email.</p>
        <p>Best,<br>The Jippy Team</p>
      </body>
    </html>
    """

    send_email(receiving_email_addr, subject, plain_message, html_message)
