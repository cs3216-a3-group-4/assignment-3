from fastapi import APIRouter, Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from src.auth.dependencies import add_current_user
from src.auth.router import (
    router as auth_router,
    routerWithAuth as auth_router_authenticated,
)
from src.billing.router import (
    router as billing_router,
    routerWithAuth as billing_router_authenticated,
)
from src.categories.router import router as category_router
from src.profile.router import router as profile_router
from src.events.router import router as events_router
from src.user_questions.router import router as user_questions_router
from src.notes.router import router as notes_router, points_router
from src.likes.router import router as likes_router
from src.essays.router import router as essays_router
from src.articles.router import router as articles_router
from src.subscriptions.router import router as subscriptions_router
from src.daily_practice.router import router as daily_practices_router


from contextlib import asynccontextmanager

import logging
import traceback

from src.common.constants import EMAIL_ALERTS_ENABLED, FRONTEND_URL
from src.utils.mail import send_error_email

logging.getLogger("passlib").setLevel(logging.ERROR)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run before server start
    yield
    # Run after server stops


server = FastAPI(title="Jippy 🐸 Backend", lifespan=lifespan)

origins = [FRONTEND_URL]

server.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@server.exception_handler(500)
async def internal_server_error_handler(request: Request, exc: Exception):
    """Custom handler for 500 errors."""
    # Extract traceback and request information
    error_message = "".join(traceback.format_exception(None, exc, exc.__traceback__))
    message = f"An error occurred:\n\nURL: {request.url}\n\n{error_message}"

    # Send an email alert
    if EMAIL_ALERTS_ENABLED:
        send_error_email(message)

    # Return a JSON response to the user
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
    )


server.include_router(auth_router)
server.include_router(billing_router)

authenticated_router = APIRouter(prefix="", dependencies=[Depends(add_current_user)])
authenticated_router.include_router(auth_router_authenticated)
authenticated_router.include_router(billing_router_authenticated)
authenticated_router.include_router(category_router)
authenticated_router.include_router(profile_router)
authenticated_router.include_router(events_router)
authenticated_router.include_router(user_questions_router)
authenticated_router.include_router(notes_router)
authenticated_router.include_router(points_router)
authenticated_router.include_router(likes_router)
authenticated_router.include_router(essays_router)
authenticated_router.include_router(articles_router)
authenticated_router.include_router(subscriptions_router)
authenticated_router.include_router(daily_practices_router)

server.include_router(authenticated_router)
