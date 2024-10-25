import { useMutation } from "@tanstack/react-query";
import { createCheckoutSessionBillingCreateCheckoutSessionPost, createCustomerPortalSessionBillingCreateCustomerPortalSessionPost, downgradeSubscriptionBillingDowngradeSubscriptionPut } from "@/client/services.gen";
import { useRouter } from "next/navigation";

export const useCreateStripeCheckoutSession = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ price_id, tier_id }: { price_id: string, tier_id: number }) => {
      return createCheckoutSessionBillingCreateCheckoutSessionPost({
        body: {
          // Stripe price ID
          price_id,
          // Tier ID associated with payment
          tier_id
        }, 
      }).then(response => {
        return { data: response.data as { url?: string } };
      });
    },
    onSuccess: (response: { data?: { url?: string } }) => {
      if (response.data?.url) {
        // Response contains the Stripe Checkout session URL from backend
        router.push(response.data.url);
      } else {
        console.error("No URL found in the response data");
      }
    },
    onError: (error) => {
      console.error("Error creating Stripe checkout session: ", error);
      // Redirect to checkout failed page
      router.push("/billing/?error=checkout_failed");
    },
  });
};

export const useCreateStripeCustomerPortalSession = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: () => {
      return createCustomerPortalSessionBillingCreateCustomerPortalSessionPost({}).then(response => {
        return { data: response.data as { url?: string } };
      });
    },
    onSuccess: (response: { data?: { url?: string } }) => {
      if (response.data?.url) {
        // Response contains the Stripe customer portal session URL from backend
        router.push(response.data.url);
      } else {
        console.error("No URL found in the response data");
      }
    },
    onError: (error) => {
      console.error("Error creating Stripe customer portal session: ", error);
      // Redirect to customer portal failed page
      router.push("/billing/?error=customer_portal_failed");
    },
  });
};

export const useDowngradeSubscription = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: () => {
      return downgradeSubscriptionBillingDowngradeSubscriptionPut({});
    },
    onSuccess: () => {
      // Redirect to the billing page
      router.push("/billing/?event=cnl_subs&status=success");
    },
    onError: (error) => {
      console.error("Error cancelling subscription: ", error);
      // Redirect to subscription cancellation failed page
      router.push("/billing/?event=cnl_subs&status=error&error=cancellation_failed");
    },
  });
};