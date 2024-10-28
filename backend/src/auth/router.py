from datetime import datetime
from http import HTTPStatus
from typing import Annotated
from uuid import uuid4


from fastapi import BackgroundTasks, Depends, APIRouter, HTTPException, Response
from fastapi.security import OAuth2PasswordRequestForm
import httpx
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from src.auth.utils import create_token, send_reset_password_email
from src.common.constants import (
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
)
from src.auth.schemas import Token
from src.common.dependencies import get_session
from .schemas import (
    PasswordResetCompleteData,
    PasswordResetMoreCompleteData,
    PasswordResetRequestData,
    SignUpData,
    UserPublic,
)

from src.auth.dependencies import (
    add_current_user,
    authenticate_user,
    get_current_user,
    get_password_hash,
    verify_password,
)
from .models import AccountType, PasswordReset, User

router = APIRouter(prefix="/auth", tags=["auth"])

#######################
# username & password #
#######################


@router.post("/signup")
def sign_up(
    data: SignUpData, response: Response, session=Depends(get_session)
) -> Token:
    existing_user = session.scalars(
        select(User).where(User.email == data.email)
    ).first()
    if existing_user:
        raise HTTPException(HTTPStatus.CONFLICT)

    new_user = User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        account_type=AccountType.NORMAL,
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return create_token(new_user, response)


@router.post("/login")
def log_in(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], response: Response
) -> Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Incorrect username or password.",
        )

    return create_token(user, response)


#######################
#     google auth     #
#######################
@router.get("/login/google")
def login_google():
    return {
        "url": f"https://accounts.google.com/o/oauth2/auth?response_type=code&client_id={GOOGLE_CLIENT_ID}&redirect_uri={GOOGLE_REDIRECT_URI}&scope=openid%20profile%20email&access_type=offline"
    }


@router.get("/google")
def auth_google(
    code: str,
    response: Response,
    session=Depends(get_session),
) -> Token:
    # 1. Do google oauth stuff
    token_url = "https://accounts.google.com/o/oauth2/token"
    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,  # noqa: F821
        "redirect_uri": GOOGLE_REDIRECT_URI,  # noqa: F821
        "grant_type": "authorization_code",
    }

    access_token_json = httpx.post(token_url, data=data).json()
    access_token = access_token_json.get("access_token")
    user_info = httpx.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
    ).json()
    # 2. Check for existing user.
    email = user_info["email"]
    user = session.scalars(
        select(User).where(User.email == email).options(selectinload(User.categories))
    ).first()
    if user:
        if user.account_type == AccountType.NORMAL:
            raise HTTPException(
                HTTPStatus.CONFLICT, "there exists a normal (non-google) account"
            )
    else:
        user = User(
            email=email,
            # doesnt matter
            hashed_password=get_password_hash(GOOGLE_CLIENT_SECRET),
            account_type=AccountType.GOOGLE,
        )
        session.add(user)
        session.commit()

    # 3. Add jwt token
    token = create_token(user, response)

    # TODO: redirect to correct frontend page
    return token


routerWithAuth = APIRouter(
    prefix="/auth", tags=["auth"], dependencies=[Depends(add_current_user)]
)


@routerWithAuth.get("/session")
def get_user(
    current_user: Annotated[User, Depends(get_current_user)],
    session=Depends(get_session),
) -> UserPublic:
    raise ValueError("testing 500 error email notification")
    user = session.get(User, current_user.id)
    if user:
        user.last_accessed = datetime.now()
        session.add(user)
        session.commit()

    return current_user


@routerWithAuth.get("/logout")
def logout(response: Response):
    response.delete_cookie(key="session")
    return ""


@routerWithAuth.post("/password-reset")
def request_password_reset(
    data: PasswordResetRequestData,
    background_task: BackgroundTasks,
    session=Depends(get_session),
):
    email = data.email
    user = session.scalars(
        select(User)
        .where(User.email == email)
        .where(User.account_type == AccountType.NORMAL)
    ).first()
    if not user:
        return

    code = str(uuid4())
    password_reset = PasswordReset(user_id=user.id, code=code, used=False)
    session.add(password_reset)
    session.commit()
    background_task.add_task(send_reset_password_email, email, code)


@routerWithAuth.put("/password-reset")
def complete_password_reset(
    code: str,
    data: PasswordResetCompleteData,
    session=Depends(get_session),
):
    # 9b90a1bd-ccab-4dcb-93c9-9ef2367dbcc4
    password_reset = session.scalars(
        select(PasswordReset).where(PasswordReset.code == code)
    ).first()
    if not password_reset or password_reset.used:
        raise HTTPException(HTTPStatus.NOT_FOUND)

    user = session.get(User, password_reset.user_id)
    user.hashed_password = get_password_hash(data.password)
    password_reset.used = True
    session.add(user)
    session.add(password_reset)
    session.commit()


@routerWithAuth.put("/change-password")
def change_password(
    user: Annotated[User, Depends(get_current_user)],
    data: PasswordResetMoreCompleteData,
    session=Depends(get_session),
):
    if not verify_password(data.old_password, user.hashed_password):
        raise HTTPException(HTTPStatus.UNAUTHORIZED)
    user.hashed_password = get_password_hash(data.password)
    session.add(user)
    session.commit()
