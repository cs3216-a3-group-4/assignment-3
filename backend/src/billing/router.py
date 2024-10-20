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
    user: Annotated[User, Depends(get_current_user)],
    session=Depends(get_session),
):
    price_id = request_data.price_id
    tier_id = request_data.tier_id

    try:
        checkout_session = stripe.checkout.Session.create(
            client_reference_id=str(user.id),
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

        # Create new stripe session object
        stripe_session_id = checkout_session.id
        user_id = user.id
        new_stripe_session = StripeSession(
            id=stripe_session_id,
            # Subscription ID has to be updated later by webhook event handler
            subscription_id="",
            user_id=user_id,
            tier_id=tier_id,
        )
        # Save new stripe session to database
        session.add(new_stripe_session)
        session.commit()
        session.refresh(new_stripe_session)

        # Return stripe checkout URL to frontend for redirect
        return RedirectResponse(
            url=checkout_session.url, status_code=HTTPStatus.SEE_OTHER
        )
    except Exception as e:
        raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail=str(e))


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
    elif event_type == "invoice.paid":
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
    elif event_type == "charge.dispute.created":
        handle_charge_dispute_created(event)
    elif event_type == "charge.dispute.closed":
        handle_charge_dispute_closed(event)

    return {"status": "success"}


def handle_checkout_completed(event):
    # Update your database to reflect checkout completion
    pass


def handle_payment_success(event):
    # Subscription renewed successfully, update your database to reflect payment success
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

def handle_charge_dispute_created(event):
    # Update user subscription status to paused
    pass

def handle_charge_dispute_closed(event):
    # Update user subscription status based on whether customer won or we won
    pass