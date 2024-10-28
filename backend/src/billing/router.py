from datetime import datetime
from http import HTTPStatus
import traceback
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Request, Header, Response
from sqlalchemy import select
from src.auth.dependencies import add_current_user, get_current_user
from src.auth.models import User
from src.billing.models import StripePrice, StripeProduct, StripeSession
from src.common.constants import FRONTEND_URL, STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET
from src.common.dependencies import get_session
from src.subscriptions.models import Subscription
from .schemas import CheckoutRequestData
import stripe

FREE_TIER_ID = 1
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


@routerWithAuth.post("/create-customer-portal-session")
async def create_customer_portal_session(
    user: Annotated[User, Depends(get_current_user)],
):
    if not user.subscription:
        print(
            f"""ERROR: User with ID {user.id} does not have an existing subscription"""
        )
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="User does not have an existing subscription",
        )
    try:
        stripe_customer_id: str = user.subscription.customer_id
        # Create a new customer portal session
        portal_session = stripe.billing_portal.Session.create(
            customer=stripe_customer_id,
            return_url=f"""{FRONTEND_URL}/{FRONTEND_BILLING_URL_PATH}""",
        )
        return {
            "url": portal_session.url if portal_session.url else "",
        }
    except Exception as e:
        traceback.print_exception(e)
        raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail=str(e))


@routerWithAuth.put("/downgrade-subscription")
async def downgrade_subscription(
    user: Annotated[User, Depends(get_current_user)],
):
    if not user.subscription:
        print(
            f"""ERROR: User with ID {user.id} does not have an existing subscription, nothing to downgrade"""
        )
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="User does not have an existing subscription to downgrade",
        )
    try:
        # Call stripe API to cancel subscription immediately
        stripe_subscription_id: str = user.subscription.id
        stripe_subscription = stripe.Subscription.retrieve(stripe_subscription_id)
        stripe_subscription.delete(prorate=False)

        return Response(
            content='{"status": "success"}',
            media_type="application/json",
            status_code=HTTPStatus.OK,
        )
    except Exception as e:
        traceback.print_exception(e)
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
        elif event_type == "product.created" or event_type == "product.updated":
            handle_stripe_product_event(event, session)
        elif event_type == "price.created" or event_type == "price.updated":
            handle_stripe_price_event(event, session)
        else:
            # Unable to handle given event type, so respond that it's not implemented
            raise HTTPException(
                status_code=HTTPStatus.NOT_IMPLEMENTED,
                detail=f"""Unable to handle event type: {event_type}""",
            )

        # Processed given webhook event successfully, so return success status with HTTP response status code 200
        return Response(
            content='{"status": "success"}',
            media_type="application/json",
            status_code=HTTPStatus.OK,
        )

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
        print(
            "ERROR: Cannot process invoice.paid stripe event since invoice subscription ID is empty"
        )
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail="Error processing invoice.paid event due to empty subscription ID in invoice",
        )

    stripe_subscription = stripe.Subscription.retrieve(subscription_id)
    if stripe_subscription["status"] == "active":
        # Check whether the given subscription is already saved in database
        subscription_to_save = session.scalars(
            select(Subscription).where(Subscription.id == subscription_id)
        ).one_or_none()
        if subscription_to_save is not None:
            subscription_to_save.status = stripe_subscription["status"]
            session.add(subscription_to_save)
            session.commit()
            session.refresh(subscription_to_save)

    billing_reason = invoice["billing_reason"]
    if (
        billing_reason == "subscription_create"
        or billing_reason == "subscription_update"
    ):
        # Subscription has changed(i.e. new tier), upgrade user's tier after successful payment
        do_tier_upgrade(subscription_id, session)


def handle_payment_failure(event):
    # Notify user of payment failure or retry logic
    pass


def handle_subscription_created(event, session):
    subscription: stripe.Subscription = event["data"]["object"]
    if not subscription["id"]:
        print(
            "ERROR: Cannot process subscription created stripe event since given subscription ID is empty"
        )
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail="Error processing subscription created stripe event due to empty subscription ID provided",
        )
    
    # Insert subscription data into our database
    ## But check and delete all existing subscriptions for this user first
    update_subscription_for(subscription, session, True)


def handle_subscription_canceled(event, session):
    # Stripe event object is a stripe.Subscription, get its ID
    subscription_id = event["data"]["object"]["id"]
    # Check whether subscription ID is blank
    if not subscription_id:
        # Don't proceed if subscription ID is empty
        print(
            "ERROR: Cannot process subscription cancelled stripe event since given subscription ID is empty"
        )
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail="Error processing subscription cancelled stripe event due to empty subscription ID provided",
        )
    
    subscription_to_delete = session.scalars(
        select(Subscription).where(Subscription.id == subscription_id)
    ).one_or_none()
    if subscription_to_delete is not None:
        # Delete cancelled subscription from database
        session.delete(subscription_to_delete)
        session.commit()

    # Find user id for the given subscription using stripe_session table
    stripe_session = session.scalars(
        select(StripeSession).where(StripeSession.subscription_id == subscription_id)
    ).one_or_none()
    if stripe_session is None:
        print(
            f"""ERROR: Cannot identify corresponding stripe checkout session for subscription with ID {subscription_id}"""
        )
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail=f"""ERROR: Cannot identify corresponding stripe checkout session for subscription with ID {subscription_id}""",
        )
    if not stripe_session.user_id:
        print(
            f"""ERROR: Cannot identify corresponding user for subscription with ID {subscription_id}"""
        )
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail=f"""ERROR: Cannot identify corresponding user for subscription with ID {subscription_id}""",
        )
    # Reset user tier to free tier
    reset_user_tier(stripe_session.user_id, session)


def handle_subscription_paused(event, session):
    subscription: stripe.Subscription = event["data"]["object"]
    subscription_id: str = subscription["id"]
    # Check whether subscription ID is blank
    if not subscription_id:
        # Don't proceed if subscription ID is empty
        print(
            "ERROR: Cannot process subscription paused stripe event since given subscription ID is empty"
        )
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail="Error processing subscription paused stripe event due to empty subscription ID provided",
        )
    
    update_subscription_for(subscription, session)

    # Find user id for the given subscription using stripe_session table
    stripe_session = session.scalars(
        select(StripeSession).where(StripeSession.subscription_id == subscription_id)
    ).one_or_none()
    if stripe_session is None:
        print(
            f"""ERROR: Cannot identify corresponding stripe checkout session for subscription with ID {subscription_id}"""
        )
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail=f"""ERROR: Cannot identify corresponding stripe checkout session for subscription with ID {subscription_id}""",
        )
    if not stripe_session.user_id:
        print(
            f"""ERROR: Cannot identify corresponding user for subscription with ID {subscription_id}"""
        )
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail=f"""ERROR: Cannot identify corresponding user for subscription with ID {subscription_id}""",
        )
    # Reset user tier to free tier
    ## TODO: Don't downgrade user's tier but just detect that the subscription is paused
    reset_user_tier(stripe_session.user_id, session)

    # TODO: Consider how to notify the frontend about this


def handle_subscription_resumed(event, session):
    subscription: stripe.Subscription = event["data"]["object"]
    subscription_id: str = subscription["id"]
    # Check whether subscription ID is blank
    if not subscription_id:
        # Don't proceed if subscription ID is empty
        print(
            "ERROR: Cannot process subscription resumed stripe event since given subscription ID is empty"
        )
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail="Error processing subscription resumed stripe event due to empty subscription ID provided",
        )
    
    update_subscription_for(subscription, session)

    # Upgrade tier here since invoice.paid event might not be triggered, but we
    #   downgrade the user tier when subscription is paused
    do_tier_upgrade(subscription_id, session)

    # TODO: Consider how to notify the frontend about this


def handle_subscription_updated(event, session):
    subscription: stripe.Subscription = event["data"]["object"]
    # Check whether subscription ID is blank
    if not subscription["id"]:
        # Don't proceed if subscription ID is empty
        print(
            "ERROR: Cannot update subscription data in database since given subscription ID is empty"
        )
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail="Error parsing updated subscription data due to empty subscription ID provided",
        )
    update_subscription_for(subscription, session)
    # TODO: Update user tier_id if needed


def handle_charge_dispute_created(event):
    # Update user subscription status to paused
    pass


def handle_charge_dispute_closed(event):
    # Update user subscription status based on whether customer won or we won
    pass


def handle_stripe_price_event(event, session):
    stripe_price: stripe.Price = event["data"]["object"]
    stripe_price_id: str = stripe_price["id"]
    stripe_price_product_id: str = stripe_price["product"]
    stripe_price_description: str = stripe_price["nickname"]
    stripe_price_payment_interval: str = stripe_price["recurring"]["interval"]
    stripe_price_price_cents: int = stripe_price["unit_amount"]
    stripe_price_currency: str = stripe_price["currency"]
    stripe_price_is_active: bool = stripe_price["active"]

    # Check whether the given stripe price is already saved in database
    price_to_save = session.scalars(
        select(StripePrice).where(StripePrice.id == stripe_price_id)
    ).one_or_none()
    if price_to_save is None:
        # Only create new StripePrice with the given stripe price
        #   data if this ID isn't already saved in the database
        price_to_save = StripePrice(
            id=stripe_price_id,
            product_id=stripe_price_product_id,
            description=stripe_price_description,
            payment_interval=stripe_price_payment_interval,
            price=stripe_price_price_cents,
            currency=stripe_price_currency,
            is_active=stripe_price_is_active,
        )
    else:
        # Update stripe price data saved in database(regardless of whether this is a newly created stripe price)
        price_to_save.product_id = stripe_price_product_id
        price_to_save.description = stripe_price_description
        price_to_save.payment_interval = stripe_price_payment_interval
        price_to_save.price = stripe_price_price_cents
        price_to_save.currency = stripe_price_currency
        price_to_save.is_active = stripe_price_is_active

    session.add(price_to_save)
    session.commit()
    session.refresh(price_to_save)


def handle_stripe_product_event(event, session):
    stripe_product: stripe.Product = event["data"]["object"]
    stripe_product_id: str = stripe_product["id"]
    stripe_product_name: str = stripe_product["name"]
    stripe_product_description: str = stripe_product["description"]
    stripe_product_image_url: str = (
        stripe_product["images"][0] if stripe_product["images"] else ""
    )
    stripe_product_is_active: bool = stripe_product["active"]
    stripe_product_features: list[str] = get_list_of_feature_strings_for(
        stripe_product["marketing_features"]
    )

    # Check whether the given stripe product is already saved in database
    product_to_save = session.scalars(
        select(StripeProduct).where(StripeProduct.id == stripe_product_id)
    ).one_or_none()
    if product_to_save is None:
        # Only create new StripeProduct with the given stripe product
        #   data if this ID isn't already saved in the database
        product_to_save = StripeProduct(
            id=stripe_product_id,
            name=stripe_product_name,
            description=stripe_product_description,
            image_url=stripe_product_image_url,
            is_active=stripe_product_is_active,
            features=stripe_product_features,
        )
    else:
        # Update stripe product data saved in database(regardless of whether this is a newly created stripe product)
        product_to_save.name = stripe_product_name
        product_to_save.description = stripe_product_description
        product_to_save.image_url = stripe_product_image_url
        product_to_save.is_active = stripe_product_is_active
        product_to_save.features = stripe_product_features

    session.add(product_to_save)
    session.commit()
    session.refresh(product_to_save)


def get_list_of_feature_strings_for(features: list[stripe.Product.MarketingFeature]):
    return [feature["name"] for feature in features]


def update_session(checkout_session: stripe.checkout.Session, session):
    if checkout_session["mode"] != "subscription":
        print(
            f"""ERROR: Invalid session mode received when processing checkout session: {checkout_session["mode"]}"""
        )
        raise HTTPException(
            status_code=HTTPStatus.NOT_IMPLEMENTED,
            detail=f"""Unrecognised mode received in checkout handler: {checkout_session["mode"]}""",
        )
    if not checkout_session["subscription"]:
        print(
            f"""ERROR: Invalid subscription ID received when processing checkout session: {checkout_session["subscription"]}"""
        )
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail=f"""Invalid subscription ID received in checkout handler: {checkout_session["subscription"]}""",
        )
    if not checkout_session["customer"]:
        print(
            f"""ERROR: Invalid customer ID received when processing checkout session: {checkout_session["customer"]}"""
        )
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


def update_subscription_for(
    subscription: stripe.Subscription, session, is_new_subscription: bool = False
):
    if not subscription["id"]:
        print(
            f"""ERROR: Invalid subscription ID received when processing subscription update: {subscription["id"]}"""
        )
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail=f"""Invalid subscription ID received: {subscription["id"]}""",
        )
    if not subscription["customer"]:
        print(
            f"""ERROR: Invalid customer ID received when processing subscription update: {subscription["customer"]}"""
        )
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail=f"""Invalid customer ID received: {subscription["customer"]}""",
        )
    subscription_id: str = subscription["id"]
    customer_id: str = str(subscription["customer"])

    stripe_subscription = stripe.Subscription.retrieve(subscription_id)
    subscription_data = stripe_subscription["items"]["data"][0]
    price_id: str = subscription_data["price"]["id"]
    subscription_status = stripe_subscription["status"]

    if is_new_subscription:
        # Delete all existing subscriptions for this user from our database
        ## This prevents duplicate subscriptions for the same user
        other_subscriptions = session.scalars(
            select(Subscription)
            .where(Subscription.customer_id == customer_id)
            .where(Subscription.id != subscription_id)
        ).all()
        for other_subscription in other_subscriptions:
            if other_subscription.status == "active":
                # Cancel existing subscription if it's still active
                stripe.Subscription.delete(other_subscription.id)
            # Delete subscription only after it's no longer active
            session.delete(other_subscription)
        session.commit()

    # Check whether the given subscription is already saved in database
    subscription_to_save = session.scalars(
        select(Subscription).where(Subscription.id == subscription_id)
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
    subscription_to_save.status = subscription_status

    stripe_session = session.scalars(
        select(StripeSession).where(StripeSession.subscription_id == subscription_id)
    ).one_or_none()
    if stripe_session is not None and stripe_session.user_id:
        # Only update the subscription.user_id in the database if checkout session
        #   has completed and saved the user ID in the stripe_session table
        user_id: int = int(stripe_session.user_id)
        subscription_to_save.user_id = user_id

    session.add(subscription_to_save)
    session.commit()
    session.refresh(subscription_to_save)

    if subscription_status != "active" and stripe_session.user_id:
        # Reset user tier to free tier if subscription update is a cancellation or the like
        reset_user_tier(stripe_session.user_id, session)


def do_tier_upgrade(subscription_id: str, session):
    # Validation check for subscription ID
    if not subscription_id:
        # Unable to continue without subscription ID
        print("ERROR: Invalid subscription ID received")
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="Invalid subscription ID received",
        )
    
    stripe_session = session.scalars(
        select(StripeSession).where(StripeSession.subscription_id == subscription_id)
    ).one_or_none()
    if stripe_session is None:
        print(
            f"""ERROR: Cannot identify corresponding stripe checkout session for subscription with ID {subscription_id}"""
        )
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail=f"""ERROR: Cannot identify corresponding stripe checkout session for subscription with ID {subscription_id}""",
        )

    stripe_subscription = stripe.Subscription.retrieve(subscription_id)
    if stripe_subscription["status"] != "active":
        if stripe_session.user_id:
            print(
                f"""WARNING: Tried to upgrade user tier associated with subscription with ID {subscription_id} that is not active"""
            )
        else:
            print(
                f"""WARNING: Tried to upgrade user tier of user with ID {stripe_session.user_id} who has subscription with ID {subscription_id} that is not active"""
            )
        return

    if not stripe_session.user_id:
        print(
            f"""ERROR: Cannot identify corresponding user for subscription with ID {subscription_id}"""
        )
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail=f"""ERROR: Cannot identify corresponding user for subscription with ID {subscription_id}""",
        )

    user = session.scalars(
        select(User).where(User.id == stripe_session.user_id)
    ).one_or_none()

    if user is None:
        print(
            f"""ERROR: No corresponding user found for subscription with ID {subscription_id}"""
        )
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail=f"""ERROR: No corresponding user found for subscription with ID {subscription_id}""",
        )

    # Upgrade user tier now that subscription is paid for and active
    user.tier_id = stripe_session.tier_id
    session.add(user)
    session.commit()
    session.refresh(user)


def reset_user_tier(user_id: int, session):
    set_user_tier(user_id, FREE_TIER_ID, session)


def set_user_tier(user_id: int, tier_id: int, session):
    user = session.scalars(select(User).where(User.id == user_id)).one_or_none()
    if user is None:
        print(f"""ERROR: Cannot find user with ID {user_id} to update tier""")
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail="ERROR: Cannot find corresponding user for subscription",
        )

    user.tier_id = tier_id
    session.add(user)
    session.commit()
    session.refresh(user)
