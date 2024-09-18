from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.auth.router import router as auth_router
from contextlib import asynccontextmanager

import logging

from src.common.base import Base
from src.common.database import engine

logging.getLogger("passlib").setLevel(logging.ERROR)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    yield


server = FastAPI(lifespan=lifespan)

# TODO: refactor to env variable
origins = ["http://localhost:3000"]

server.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

server.include_router(auth_router)
