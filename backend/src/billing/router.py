from datetime import datetime
from http import HTTPStatus
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Request, Header
from fastapi.responses import RedirectResponse
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.billing.models import StripeSession
from src.common.constants import FRONTEND_URL, STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET
from src.common.dependencies import get_session
from src.subscriptions.models import Subscription
from .schemas import CheckoutRequestData
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
            url=checkout_session.url if checkout_session.url else "",
            status_code=HTTPStatus.SEE_OTHER,
        )
    except Exception as e:
        raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None),
    session=Depends(get_session),
):
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
    except stripe.error.SignatureVerificationError as e:  # type: ignore
        # Invalid signature
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST, detail=f"""Invalid signature: {e}"""
        )

    if event_type == "checkout.session.completed":
        handle_checkout_completed(event, session)
    elif event_type == "invoice.paid":
        handle_payment_success(event)
    elif event_type == "invoice.payment_failed":
        handle_payment_failure(event)
    elif event_type == "customer.subscription.created":
        handle_subscription_created(event, session)
    elif event_type == "customer.subscription.deleted":
        handle_subscription_canceled(event, session)
    elif event_type == "customer.subscription.paused":
        handle_subscription_paused(event, session)
    elif event_type == "customer.subscription.resumed":
        handle_subscription_resumed(event, session)
    elif event_type == "customer.subscription.updated":
        handle_subscription_updated(event, session)
    elif event_type == "charge.dispute.created":
        handle_charge_dispute_created(event)
    elif event_type == "charge.dispute.closed":
        handle_charge_dispute_closed(event)

    return {"status": "success"}


def handle_checkout_completed(event, session):
    checkout_session: stripe.checkout.Session = event.data.object
    update_subscription_for(checkout_session, session)


def handle_payment_success(event):
    # Subscription renewed successfully, update your database to reflect payment success
    pass


def handle_payment_failure(event):
    # Notify user of payment failure or retry logic
    pass


def handle_subscription_created(event, session):
    checkout_session: stripe.checkout.Session = event.data.object
    update_subscription_for(checkout_session, session)
    # TODO: Update user tier_id


def handle_subscription_canceled(event, session):
    checkout_session: stripe.checkout.Session = event.data.object
    update_subscription_for(checkout_session, session)
    # TODO: Update user tier_id


def handle_subscription_paused(event, session):
    checkout_session: stripe.checkout.Session = event.data.object
    update_subscription_for(checkout_session, session)
    # TODO: Consider how to notify the frontend about this


def handle_subscription_resumed(event, session):
    checkout_session: stripe.checkout.Session = event.data.object
    update_subscription_for(checkout_session, session)
    # TODO: Consider how to notify the frontend about this


def handle_subscription_updated(event, session):
    checkout_session: stripe.checkout.Session = event.data.object
    update_subscription_for(checkout_session, session)
    # TODO: Update user tier_id if needed


def handle_charge_dispute_created(event):
    # Update user subscription status to paused
    pass


def handle_charge_dispute_closed(event):
    # Update user subscription status based on whether customer won or we won
    pass


def update_subscription_for(checkout_session: stripe.checkout.Session, session):
    if checkout_session.mode != "subscription":
        return
    # Update stripe_session table to with updated subscription data from stripe
    subscriptionId: str = str(checkout_session.subscription)
    customer_id: str = str(checkout_session.customer)
    stripe_session = session.get(StripeSession, checkout_session.id)
    user_id: int = int(
        checkout_session.client_reference_id
        if checkout_session.client_reference_id
        else stripe_session.user_id
    )

    stripe_subscription = stripe.Subscription.retrieve(subscriptionId)
    new_subscription = Subscription(
        id=subscriptionId,
        user_id=user_id,
        price_id=stripe_subscription.items.data[0].price.id,
        customer_id=customer_id,
        status=stripe_subscription.status,
        quantity=stripe_subscription.items.data[0].quantity,
        subscription_period_end=datetime.fromtimestamp(
            stripe_subscription.current_period_end
        ).isoformat()
        if stripe_subscription.current_period_end
        else None,
        subscription_ended_date=datetime.fromtimestamp(
            stripe_subscription.ended_at
        ).isoformat()
        if stripe_subscription.ended_at
        else None,
        subscription_cancel_at=datetime.fromtimestamp(
            stripe_subscription.cancel_at_period_end
        ).isoformat()
        if stripe_subscription.cancel_at_period_end
        else None,
        subscription_cancelled_date=datetime.fromtimestamp(
            stripe_subscription.canceled_at
        ).isoformat()
        if stripe_subscription.canceled_at
        else None,
    )
    session.add(new_subscription)
    session.commit()
    session.refresh(new_subscription)

    # Populate user.subscription with updated subscription
    ##  This populates subscription.user as well
    current_user = session.get(User, user_id)
    current_user.subscription = stripe_subscription
    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    if not stripe_session.subscription_id:
        stripe_session.subscription_id = subscriptionId
        session.add(stripe_session)
        session.commit()
        session.refresh(stripe_session)
