from http import HTTPStatus
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Request, Header
from fastapi.responses import RedirectResponse
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.billing.models import StripeSession
from src.common.constants import FRONTEND_URL, STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET
from src.common.dependencies import get_session
from .schemas import CheckoutRequestData, StripeSessionCreate, StripeSessionDTO
import stripe

stripe.api_key = STRIPE_API_KEY
router = APIRouter(prefix="/billing", tags=["billing"])


@router.post("/create-checkout-session")
async def create_checkout_session(
    request_data: CheckoutRequestData,
    _: Annotated[User, Depends(get_current_user)],
):
    price_id = request_data.price_id

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            line_items=[
                {
                    "price": price_id,
                    "quantity": 1,
                }
            ],
            success_url=f"""{FRONTEND_URL}/billing/?success=true&session_id={{CHECKOUT_SESSION_ID}}""",
            cancel_url=f"""{FRONTEND_URL}/billing/?cancelled=true""",
        )
        return RedirectResponse(
            url=checkout_session.url, status_code=HTTPStatus.SEE_OTHER
        )
    except Exception as e:
        raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/sessions")
def create_session(
    stripe_session: StripeSessionCreate,
    user: Annotated[User, Depends(get_current_user)],
    session=Depends(get_session),
) -> StripeSessionDTO:
    new_stripe_session = StripeSession(
        id=stripe_session.stripe_session.id,
        subscription_id=stripe_session.stripe_session.subscription,
        user_id=user.id,
    )
    session.add(new_stripe_session)
    session.commit()
    session.refresh(new_stripe_session)
    return new_stripe_session


@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    payload = await request.body()
    webhook_secret = STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, webhook_secret
        )
        event_type = event["type"]
    except ValueError as e:
        # Invalid payload
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST, detail=f"""Invalid payload: {e}"""
        )
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST, detail=f"""Invalid signature: {e}"""
        )

    if event_type == "checkout.session.completed":
        handle_checkout_completed(event)
    elif event_type == "invoice.payment_succeeded":
        handle_payment_success(event)
    elif event_type == "invoice.payment_failed":
        handle_payment_failure(event)
    elif event_type == "customer.subscription.created":
        handle_subscription_created(event)
    elif event_type == "customer.subscription.deleted":
        handle_subscription_canceled(event)
    elif event_type == "customer.subscription.paused":
        handle_subscription_paused(event)
    elif event_type == "customer.subscription.resumed":
        handle_subscription_resumed(event)
    elif event_type == "customer.subscription.updated":
        handle_subscription_updated(event)

    return {"status": "success"}


def handle_checkout_completed(event):
    # Update your database to reflect checkout completion
    pass


def handle_payment_success(event):
    # Update your database to reflect payment success
    pass


def handle_payment_failure(event):
    # Notify user of payment failure or retry logic
    pass


def handle_subscription_created(event):
    # Mark subscription as active in the database
    pass


def handle_subscription_canceled(event):
    # Mark subscription as canceled in the database
    pass


def handle_subscription_paused(event):
    # Mark subscription as paused in the database
    pass


def handle_subscription_resumed(event):
    # Mark subscription as resumed in the database
    pass


def handle_subscription_updated(event):
    # Update subscription status (e.g., trial ended, renewed)
    pass
