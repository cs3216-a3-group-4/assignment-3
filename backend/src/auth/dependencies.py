from typing import Annotated, Optional
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from fastapi import Cookie, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.common.database import engine
from .models import User
import jwt
from jwt.exceptions import InvalidTokenError
from src.common.constants import SECRET_KEY


class OAuth2IgnoreError(OAuth2PasswordBearer):
    """Ignore HTTP error because we want to accept cookie auth too"""

    async def __call__(self, request: Request) -> Optional[str]:
        try:
            return await super().__call__(request)
        except HTTPException:
            return ""


# This url = login post url
oauth2_scheme = OAuth2IgnoreError(tokenUrl="/auth/login")


ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

##################
# Password utils #
##################

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str):
    return pwd_context.hash(password)


def authenticate_user(email: str, password: str):
    with Session(engine) as session:
        user = session.scalars(select(User).where(User.email == email)).first()
        if not user:
            return False
        if not verify_password(password, user.hashed_password):
            return False
        return user


###############
#  jwt utils  #
###############


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


###################
# auth dependency #
###################


async def get_current_user(
    token: Annotated[str | None, Depends(oauth2_scheme)],
    session: Annotated[str | None, Cookie()] = None,
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        token = token or session
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id = payload.get("sub")
        with Session(engine) as session:
            staff = session.get(User, id)
        if not staff:
            raise InvalidTokenError()

        return staff

    except InvalidTokenError:
        raise credentials_exception
