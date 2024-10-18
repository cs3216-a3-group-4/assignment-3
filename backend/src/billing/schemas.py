from pydantic import BaseModel


class CheckoutRequestData(BaseModel):
    # Stripe price ID for the current checkout session
    price_id: str
