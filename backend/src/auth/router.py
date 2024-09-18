from http import HTTPStatus
from typing import Annotated


from datetime import timedelta
from fastapi import Depends, APIRouter, HTTPException, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from src.common.dependencies import get_session
from .schemas import SignUpData, UserPublic, Token

from src.auth.dependencies import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    authenticate_user,
    create_access_token,
    get_current_user,
    get_password_hash,
)
from .models import AccountType, User

router = APIRouter(prefix="/auth")


@router.post("/signup")
def sign_up(data: SignUpData, session=Depends(get_session)):
    existing_user = session.scalars(
        select(User).where(User.email == data.email)
    ).first()
    if existing_user:
        print(existing_user)
        raise HTTPException(HTTPStatus.CONFLICT)

    new_user = User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        account_type=AccountType.normal,
    )
    session.add(new_user)
    session.commit()

    return


@router.post("/login")
def log_in(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], response: Response
):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Incorrect username or password.",
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )

    response.set_cookie(key="session", value=access_token)
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserPublic.model_validate(user),
    )


@router.get("/session")
def get_user(staff: Annotated[User, Depends(get_current_user)]) -> UserPublic:
    return staff
