import { useMutation } from "@tanstack/react-query";
import { createCheckoutSessionBillingCreateCheckoutSessionPost } from "@/client/services.gen";
import { useRouter } from "next/navigation";

export const useCreateStripeCheckoutSession = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ price_id }: { price_id: string }) => {
      return createCheckoutSessionBillingCreateCheckoutSessionPost({
        body: {
          // Stripe price ID
          price_id 
        }, 
      });
    },
    onSuccess: (data) => {
      // Response should contain the Stripe Checkout session URL from backend
      if (data?.url) {
        router.push(data.url);
      }
    },
    onError: (error) => {
      console.error("Error creating Stripe checkout session:", error);
      // Redirect to checkout failed page
      router.push("/billing/?error=checkout_failed");
    },
  });
};