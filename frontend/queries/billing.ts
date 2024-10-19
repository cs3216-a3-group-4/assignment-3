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