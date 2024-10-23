"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import PricingTable from "@/components/billing/pricing-table";
import Chip from "@/components/display/chip";
import { useCreateStripeCheckoutSession } from "@/queries/billing";
import { useUserStore } from "@/store/user/user-store-provider";
import {
  JippyTier,
  JippyTierID,
  tierIDToTierName,
  TierPrice,
} from "@/types/billing";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const Page = () => {
  const user = useUserStore((store) => store.user);
  const stripeCheckoutMutation = useCreateStripeCheckoutSession();

  const billingPath = usePathname();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";
  const stripeSessionId = searchParams.get("session_id");
  const isCancelled = searchParams.get("cancelled") === "true";
  const router = useRouter();
  
  const { toast } = useToast();
  // Display payment status toast for 5 secs
  const PAYMENT_TOAST_DURATION = 5000;

  const jippyTiers = [
    {
      tierName: JippyTier.Free,
      isPurchased: user?.tier_id == JippyTierID.Free,
      onClickBuy: () => {},
      price: TierPrice.Free,
      tierDescription: "Basic features for GP revision",
      tierFeatures: [
        "See all events and summaries",
        "Unlimited notes with annotation and highlighting",
        "View up to 20 event analyses per week",
        "3 GP essay content generation per week",
        "1 content regeneration permitted per week",
      ],
    },
    {
      tierName: JippyTier.Premium,
      isPurchased: user?.tier_id == JippyTierID.Premium,
      onClickBuy: () => {
        stripeCheckoutMutation.mutate({
          price_id: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_TIER_PRICE_ID || "",
          tier_id: Number(process.env.NEXT_PUBLIC_PREMIUM_TIER_ID) || 1,
        });
      },
      price: TierPrice.Premium,
      tierDescription: "Enhanced features to bolster your GP revision",
      tierFeatures: [
        "All of the Free features",
        "10 GP essay content generation per week",
        "5 content regeneration permitted per week",
        "3 free essay feedback per week",
      ],
    },
  ];

  useEffect(() => {
    if (isSuccess && stripeSessionId) {
      // Display toast to notify the user that payment succeeded
      toast({
        title: "Payment Successful!",
        description: "You have now upgraded your tier",
      });

      // Remove query parameters from the URL after showing the toast
      const timeout = setTimeout(() => {
        // Remove the 'success' and 'session_id' query string from the URL
        router.replace(billingPath, { scroll: false });
      }, PAYMENT_TOAST_DURATION); // 5 seconds

      // Cleanup timeout on unmount of the page
      return () => clearTimeout(timeout);
    } else if (isCancelled) {
      // Display toast to notify the user that payment got cancelled
      toast({
        title: "Payment Cancelled",
        description: `Unable to upgrade your tier, you remain at ${tierIDToTierName(user?.tier_id || 1)} Tier`,
      });

      // Remove query parameters from the URL after showing the toast
      const timeout = setTimeout(() => {
        // Remove the 'cancelled' query string from the URL
        router.replace(billingPath, { scroll: false });
      }, PAYMENT_TOAST_DURATION);

      // Cleanup timeout on unmount of the page
      return () => clearTimeout(timeout);
    }
  }, [isSuccess, isCancelled, stripeSessionId, toast, router]);

  return (
    user && (
      <div className="flex flex-col w-full py-8">
        <div className="flex flex-col mb-8 gap-y-2 mx-8 md:mx-16 xl:mx-56 pt-8">
          <h1 className="text-3xl 2xl:text-4xl font-bold">Billing</h1>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 w-auto mx-4 md:mx-16 xl:mx-56 pb-4">
            <h2 className="text-2xl 2xl:text-3xl font-bold">Your Tier</h2>
            <div className="flex items-center gap-2">
              <h3 className="text-center">
                {tierIDToTierName(user.tier_id || 1)} Tier:
              </h3>
              <Chip
                className="w-fit"
                label="Active"
                size="lg"
                variant="primary"
              />
            </div>
          </div>
          <div className="flex flex-col w-auto gap-4 mx-4 md:mx-16 xl:mx-56 pb-4">
            <h2 className="text-2xl 2xl:text-3xl font-bold">Our Tiers</h2>
            <PricingTable tiers={jippyTiers} />
          </div>
        </div>
      </div>
    )
  );
};

export default Page;