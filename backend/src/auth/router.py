from http import HTTPStatus
from typing import Annotated


from fastapi import Depends, APIRouter, HTTPException, Response
from fastapi.security import OAuth2PasswordRequestForm
import httpx
from sqlalchemy import select
from src.auth.utils import create_token
from src.common.constants import (
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
)
from src.common.dependencies import get_session
from .schemas import SignUpData, UserPublic

from src.auth.dependencies import (
    authenticate_user,
    get_current_user,
    get_password_hash,
)
from .models import AccountType, User

router = APIRouter(prefix="/auth")

#######################
# username & password #
#######################


@router.post("/signup")
def sign_up(data: SignUpData, session=Depends(get_session)):
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
):
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
    user = session.scalars(select(User).where(User.email == email)).first()
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


@router.get("/session")
def get_user(staff: Annotated[User, Depends(get_current_user)]) -> UserPublic:
    return staff
