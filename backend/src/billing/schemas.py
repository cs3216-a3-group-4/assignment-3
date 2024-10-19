from pydantic import BaseModel


class CheckoutRequestData(BaseModel):
    # Stripe price ID for the current checkout session
    price_id: str


class StripeSessionDTO(BaseModel):
    id: str
    subscription_id: str
    user_id: int


# Based on stripe's Session JSON object returned when
#   creating a new checkout sesssion
class StripeSessionResponseDTO(BaseModel):
    id: str
    object: str
    amount_subtotal: int
    amount_total: int
    created: int
    currency: str
    livemode: bool
    mode: str
    payment_method_types: list[str]
    payment_status: str
    status: str
    subscription: str
    success_url: str
    url: str


class StripeSessionCreate(BaseModel):
    stripe_session: StripeSessionResponseDTO
    user_id: int
