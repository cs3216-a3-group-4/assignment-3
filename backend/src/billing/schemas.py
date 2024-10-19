from pydantic import BaseModel


class CheckoutRequestData(BaseModel):
    # Stripe price ID for the current checkout session
    price_id: str

class StripeSessionDTO(BaseModel):
    id: str
    subscription_id: str
    user_id: int
