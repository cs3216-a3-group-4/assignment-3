from datetime import datetime
from http import HTTPStatus
import traceback
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Request, Header, Response
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from src.auth.dependencies import add_current_user, get_current_user
from src.auth.models import User
from src.billing.models import StripeSession
from src.common.constants import FRONTEND_URL, STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET
from src.common.dependencies import get_session
from src.subscriptions.models import Subscription
from .schemas import CheckoutRequestData
import stripe

FRONTEND_BILLING_URL_PATH = "user/billing"
stripe.api_key = STRIPE_API_KEY
router = APIRouter(prefix="/billing", tags=["billing"])
routerWithAuth = APIRouter(
    prefix="/billing", tags=["billing"], dependencies=[Depends(add_current_user)]
)

@routerWithAuth.post("/create-checkout-session")
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
            success_url=f"""{FRONTEND_URL}/{FRONTEND_BILLING_URL_PATH}/?success=true&session_id={{CHECKOUT_SESSION_ID}}""",
            cancel_url=f"""{FRONTEND_URL}/{FRONTEND_BILLING_URL_PATH}/?cancelled=true""",
        )

        # Create new stripe session object
        stripe_session_id = checkout_session.id
        user_id = user.id
        new_stripe_session = StripeSession(
            id=stripe_session_id,
            user_id=user_id,
            tier_id=tier_id,
            # Subscription ID isn't available yet, so it'll be updated later by webhook event handler
        )
        # Save new stripe session to database
        session.add(new_stripe_session)
        session.commit()
        session.refresh(new_stripe_session)

        # Return stripe checkout URL to frontend for redirect
        return {
            "url": checkout_session.url if checkout_session.url else "",
        }
    except Exception as e:
        raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="Stripe-Signature"),
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

    try:
        if event_type == "checkout.session.completed":
            handle_checkout_completed(event, session)
        elif event_type == "invoice.created":
            handle_invoice_created(event)
        elif event_type == "invoice.paid":
            handle_payment_success(event, session)
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
        else:
            # Unable to handle given event type, so respond that it's not implemented
            raise HTTPException(
                status_code=HTTPStatus.NOT_IMPLEMENTED,
                detail=f"""Unable to handle event type: {event_type}""",
            )

        # Processed given webhook event successfully, so return success status with HTTP response status code 200
        return Response(content='{"status": "success"}', media_type="application/json", status_code=HTTPStatus.OK)
    
    except HTTPException as exc:
        # Rethrow any HTTP exceptions unmodified so we don't override the status code with HTTP status 500 in the catch block below
        raise exc
    
    except Exception as exc:
        print(f"""ERROR processing webhook event type {event_type}: """)
        traceback.print_exception(exc)
        # Indicate to the caller that an error occurred with HTTP 500 status code
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail=str(exc)
        )


def handle_checkout_completed(event, session):
    checkout_session: stripe.checkout.Session = event["data"]["object"]
    update_session(checkout_session, session)
    # In case checkout.session.completed stripe event is delayed
    #   (occurs after invoice.paid stripe event), try to upgrade user tier here as well
    do_tier_upgrade(checkout_session["subscription"], session)


def handle_invoice_created(event):
    invoice: stripe.Invoice = event["data"]["object"]
    invoice_id: str = invoice["id"]
    if invoice["status"] == "draft":
        # Only attempt to finalize the invoice if the created invoice is a draft, 
        #   otherwise the invoice will be finalized automatically by stripe
        try:
            # Call Stripe API to finalise invoice automatically so that subscription payment is charged timely
            stripe.Invoice.finalize_invoice(invoice_id)
        except stripe.error.StripeError as stripe_err:
            print(f"""ERROR: Failed to finalize invoice with ID {invoice_id}:""")
            # Print stack trace to help with debugging
            traceback.print_exception(stripe_err)
            # Notify the caller that an error occurred while finalizing invoice with HTTP 500 status code and exception string
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=f"""Error finalizing invoice with ID {invoice_id}: {stripe_err}""",
            )


def handle_payment_success(event, session):
    # Subscription renewed successfully, update your database to reflect payment success
    invoice: stripe.Invoice = event["data"]["object"]
    subscription_id: str = invoice["subscription"]
    if not subscription_id:
        print("ERROR: Cannot process invoice.paid stripe event since invoice subscription ID is empty")
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail="Error processing invoice.paid event due to empty subscription ID in invoice"
        )
    
    # Upgrade user's tier after successful payment
    do_tier_upgrade(subscription_id, session)


def handle_payment_failure(event):
    # Notify user of payment failure or retry logic
    pass


def handle_subscription_created(event, session):
    checkout_session = event["data"]["object"]
    update_subscription_for(checkout_session, session)


def handle_subscription_canceled(event, session):
    checkout_session = event["data"]["object"]
    update_subscription_for(checkout_session, session)
    # TODO: Update user tier_id


def handle_subscription_paused(event, session):
    checkout_session = event["data"]["object"]
    update_subscription_for(checkout_session, session)
    # TODO: Consider how to notify the frontend about this


def handle_subscription_resumed(event, session):
    checkout_session = event["data"]["object"]
    update_subscription_for(checkout_session, session)
    # TODO: Consider how to notify the frontend about this


def handle_subscription_updated(event, session):
    checkout_session = event["data"]["object"]
    update_subscription_for(checkout_session, session)
    # TODO: Update user tier_id if needed


def handle_charge_dispute_created(event):
    # Update user subscription status to paused
    pass


def handle_charge_dispute_closed(event):
    # Update user subscription status based on whether customer won or we won
    pass


def update_session(checkout_session: stripe.checkout.Session, session):
    if checkout_session["mode"] != "subscription":
        print(f"""ERROR: Invalid session mode received when processing checkout session: {checkout_session["mode"]}""")
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail=f"""Invalid mode received in checkout handler: {checkout_session["mode"]}""",
        )
    if not checkout_session["subscription"]:
        print(f"""ERROR: Invalid subscription ID received when processing checkout session: {checkout_session["subscription"]}""")
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail=f"""Invalid subscription ID received in checkout handler: {checkout_session["subscription"]}""",
        )
    if not checkout_session["customer"]:
        print(f"""ERROR: Invalid customer ID received when processing checkout session: {checkout_session["customer"]}""")
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail=f"""Invalid customer ID received in checkout handler: {checkout_session["customer"]}""",
        )
    # Update stripe_session table to with updated subscription data from stripe
    subscription_id: str = str(checkout_session["subscription"])
    stripe_session = session.get(StripeSession, checkout_session["id"])

    if not stripe_session.subscription_id:
        stripe_session.subscription_id = subscription_id
        session.add(stripe_session)
        session.commit()
        session.refresh(stripe_session)


def update_subscription_for(subscription: stripe.Subscription, session):
    if not subscription["id"]:
        print(f"""ERROR: Invalid subscription ID received when processing subscription update: {subscription["id"]}""")
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail=f"""Invalid subscription ID received: {subscription["id"]}""",
        )
    if not subscription["customer"]:
        print(f"""ERROR: Invalid customer ID received when processing subscription update: {subscription["customer"]}""")
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail=f"""Invalid customer ID received: {subscription["customer"]}""",
        )
    subscription_id: str = subscription["id"]
    customer_id: str = str(subscription["customer"])

    stripe_subscription = stripe.Subscription.retrieve(subscription_id)
    subscription_data = stripe_subscription['items']['data'][0]
    price_id: str = subscription_data['price']['id']
    # Check whether the given subscription is already saved in database
    subscription_to_save = session.scalars(
        select(Subscription)
        .where(Subscription.id == subscription_id)
    ).one_or_none()
    if subscription_to_save is None:
        # Only create new Subscription with the given subscription 
        #   data if this ID isn't already saved in the database
        subscription_to_save = Subscription(
            id=subscription_id,
        )
    
    # Update subscription data saved in database(regardless of whether this is a newly created subscription)
    subscription_to_save.price_id = price_id
    subscription_to_save.customer_id = customer_id
    if stripe_subscription["current_period_end"]:
        subscription_to_save.subscription_period_end = datetime.fromtimestamp(
            stripe_subscription["current_period_end"]
        )
    if stripe_subscription["ended_at"]:
        subscription_to_save.subscription_ended_date = datetime.fromtimestamp(
            stripe_subscription["ended_at"]
        )
    if stripe_subscription["cancel_at_period_end"]:
        subscription_to_save.subscription_cancel_at = datetime.fromtimestamp(
            stripe_subscription["cancel_at_period_end"]
        )
    if stripe_subscription["canceled_at"]:
        subscription_to_save.subscription_cancelled_date = datetime.fromtimestamp(
            stripe_subscription["canceled_at"]
        )
    subscription_to_save.status = stripe_subscription["status"]

    stripe_session = session.scalars(
        select(StripeSession)
        .where(StripeSession.subscription_id == subscription_id)
    ).one_or_none()
    if stripe_session is not None and stripe_session.user_id:
        # Only update the subscription.user_id in the database if checkout session
        #   has completed and saved the user ID in the stripe_session table
        user_id: int = int(stripe_session.user_id)
        subscription_to_save.user_id = user_id

    session.add(subscription_to_save)
    session.commit()
    session.refresh(subscription_to_save)

def do_tier_upgrade(subscription_id: str, session):
    stripe_session = session.scalars(
        select(StripeSession)
        .where(StripeSession.subscription_id == subscription_id)
    ).one_or_none()
    if stripe_session is None:
        print(f"""ERROR: Cannot identify corresponding stripe checkout session for subscription with ID {subscription_id}""")
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail=f"""ERROR: Cannot identify corresponding stripe checkout session for subscription with ID {subscription_id}"""
        )
        
    if not stripe_session.user_id:
        print(f"""ERROR: Cannot identify corresponding user for subscription with ID {subscription_id}""")
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail=f"""ERROR: Cannot identify corresponding user for subscription with ID {subscription_id}"""
        )

    user = session.scalars(
        select(User)
        .where(User.id == stripe_session.user_id)
    ).one_or_none()

    if user is None:
        print(f"""ERROR: No corresponding user found for subscription with ID {subscription_id}""")
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail=f"""ERROR: No corresponding user found for subscription with ID {subscription_id}"""
        )
    
    stripe_subscription = stripe.Subscription.retrieve(subscription_id)
    if stripe_subscription["status"] != "active":
        print(f"""ERROR: Subscription with ID {subscription_id} is not active even after payment""")
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail=f"""Subscription with ID {subscription_id} is not active even after payment"""
        )

    # Upgrade user tier now that subscription is paid for and active
    user.tier_id = stripe_session.tier_id
    session.add(user)
    session.commit()
    session.refresh(user)
