import smtplib
import ssl
from email.message import EmailMessage

from src.common.constants import GOOGLE_APP_PASSWORD, GOOGLE_EMAIL

PORT = 465  # For SSL


def send_email(
    receiving_email_addr: str, subject: str, message: str, html_message: str = None
):
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", PORT, context=context) as server:
        server.login(GOOGLE_EMAIL, GOOGLE_APP_PASSWORD)

        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = GOOGLE_EMAIL
        msg["To"] = receiving_email_addr
        msg.set_content(message)

        if html_message:
            msg.add_alternative(html_message, subtype="html")

        server.sendmail(GOOGLE_EMAIL, receiving_email_addr, msg.as_string())


def send_error_email(error_message: str):
    send_email(GOOGLE_EMAIL, "500 error, oh no!", error_message)
