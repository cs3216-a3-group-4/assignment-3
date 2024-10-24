from fastapi import APIRouter, Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
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


from contextlib import asynccontextmanager

import logging

from src.common.constants import FRONTEND_URL

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

server.include_router(authenticated_router)