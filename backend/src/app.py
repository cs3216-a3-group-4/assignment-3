from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.auth.router import router as auth_router
from src.categories.router import router as category_router
from src.profile.router import router as profile_router
from src.events.router import router as events_router
from src.user_questions.router import router as user_questions_router
from src.notes.router import router as notes_router, points_router
from src.likes.router import router as likes_router
from src.essays.router import router as essays_router

from contextlib import asynccontextmanager

import logging

from src.common.constants import FRONTEND_URL

logging.getLogger("passlib").setLevel(logging.ERROR)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run before server start
    yield
    # Run after server stops


server = FastAPI(lifespan=lifespan)

origins = [FRONTEND_URL]

server.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

server.include_router(auth_router)
server.include_router(category_router)
server.include_router(profile_router)
server.include_router(events_router)
server.include_router(user_questions_router)
server.include_router(notes_router)
server.include_router(points_router)
server.include_router(likes_router)
server.include_router(essays_router)
