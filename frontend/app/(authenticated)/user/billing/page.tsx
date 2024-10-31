"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { UNVERIFIED_TIER_ID } from "@/app/(authenticated)/verify-email/page";
import { UserPublic } from "@/client";
import PricingTable from "@/components/billing/pricing-table";
import Chip from "@/components/display/chip";
import UnverifiedAlert from "@/components/navigation/unverified-alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateStripeCheckoutSession,
  useCreateStripeCustomerPortalSession,
  useDowngradeSubscription,
} from "@/queries/billing";
import { useUserStore } from "@/store/user/user-store-provider";
import {
  JippyTier,
  JippyTierID,
  SubscriptionPeriod,
  tierIDToTierDescription,
  tierIDToTierFeature,
  tierIDToTierName,
  TierPrice,
} from "@/types/billing";
import SubscriptionCard from "@/components/billing/subscription-card";

const FREE_TIER_ID = 1;
const TIER_STATUS_ACTIVE = "active";

const getPriceButtonText = (
  priceTierId: number,
  user: UserPublic | undefined,
) => {
  const userTierId = user?.tier_id || 1;
  const isUserUnverified = user?.verified === false || userTierId === UNVERIFIED_TIER_ID;
  if (isUserUnverified) {
    return "Not allowed";
  } else if (priceTierId == userTierId) {
    return "Current";
  } else if (priceTierId > userTierId) {
    return "Upgrade";
  } else if (priceTierId < userTierId) {
    // Used by pricing-tier to figure out if it is a downgrade.
    // Changing this text will break the dialog.
    return "Downgrade";
  } else {
    return "Buy";
  }
};

const toPascalCase = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Page = () => {
  const user = useUserStore((store) => store.user);
  const stripeCheckoutMutation = useCreateStripeCheckoutSession();
  const stripeCustomerPortalMutation = useCreateStripeCustomerPortalSession();
  const downgradeSubscription = useDowngradeSubscription();

  const billingPath = usePathname();
  const searchParams = useSearchParams();
  const isUserUnverified = user?.verified === false || user?.tier_id === UNVERIFIED_TIER_ID;
  const hasSubscription = user?.tier_id != JippyTierID.Free && user?.tier_id !== 4;
  let isSuccess = searchParams.get("success") === "true";
  let stripeSessionId = searchParams.get("session_id");
  let isCancelled = searchParams.get("cancelled") === "true";
  const router = useRouter();

  const [userTier, setUserTier] = useState<string>("");
  const [userTierStatus, setUserTierStatus] = useState<string>("");

  const { toast } = useToast();
  // Display payment status toast for 5 secs
  const PAYMENT_TOAST_DURATION = 5000;

  const getDateFrom = (dateString: string | null | undefined) => {
    if (dateString) {
      return new Date(dateString);
    }
    return undefined;
  }

  const onClickDowngradeSubscription = () => {
    downgradeSubscription.mutate();
  };

  const onClickManageSubscription = () => {
    stripeCustomerPortalMutation.mutate();
  };

  const jippyTiers = [
    {
      tierName: JippyTier.Free,
      isButtonDisabled: isUserUnverified || user?.tier_id == JippyTierID.Free,
      buttonText: getPriceButtonText(JippyTierID.Free, user),
      onClickBuy: onClickDowngradeSubscription,
      price: TierPrice.Free,
      tierDescription: tierIDToTierDescription[JippyTierID.Free],
      tierFeatures: tierIDToTierFeature[JippyTierID.Free],
    },
    {
      tierName: JippyTier.Premium,
      isButtonDisabled:
        isUserUnverified || user?.tier_id == JippyTierID.Premium,
      buttonText: getPriceButtonText(JippyTierID.Premium, user),
      onClickBuy: () => {
        stripeCheckoutMutation.mutate({
          price_id: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_TIER_PRICE_ID || "",
          tier_id: Number(process.env.NEXT_PUBLIC_PREMIUM_TIER_ID) || 1,
        });
      },
      price: TierPrice.Premium,
      tierDescription: tierIDToTierDescription[JippyTierID.Premium],
      tierFeatures: tierIDToTierFeature[JippyTierID.Premium],
    },
  ];

  useEffect(() => {
    if (isSuccess && stripeSessionId) {
      // Display toast to notify the user that payment succeeded
      toast({
        title: "Payment Successful!",
        description: "Now upgrading your tier...",
      });

      // Remove query parameters from the URL after showing the toast
      const timeout = setTimeout(() => {
        isSuccess = false;
        stripeSessionId = "";
        // Remove the 'success' and 'session_id' query string from the URL
        router.replace(billingPath, { scroll: false });
        // TODO: Add callback to server to check whether user tier is upgraded successfully/fetch new user tier
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
        isCancelled = false;
        // Remove the 'cancelled' query string from the URL
        router.replace(billingPath, { scroll: false });
      }, PAYMENT_TOAST_DURATION);

      // Cleanup timeout on unmount of the page
      return () => clearTimeout(timeout);
    }
  }, [isSuccess, isCancelled, stripeSessionId]);

  useEffect(() => {
    if (user?.subscription) {
      setUserTierStatus(user.subscription.status);
      setUserTier(tierIDToTierName(user.tier_id || FREE_TIER_ID));
    } else {
      setUserTier(tierIDToTierName(FREE_TIER_ID));
      setUserTierStatus(TIER_STATUS_ACTIVE);
    }
  }, [user?.subscription, user?.tier_id]);

  return (
    user && (
      <div className="flex flex-col w-full py-8">
        <div className="flex flex-col mb-8 gap-y-2 px-8 md:px-16 xl:px-56 pt-8">
          <h1 className="text-3xl 2xl:text-4xl font-bold">Billing</h1>
        </div>
        <div className="flex flex-col gap-8 px-8 md:px-16 xl:px-56">
          <div className="flex flex-col gap-4 w-auto pb-4">
            <SubscriptionCard
              user={user} />
          </div>
          <div className="flex flex-col gap-4 w-auto pb-4">
            <h2 className="text-2xl 2xl:text-3xl font-bold">Our Tiers</h2>
            <PricingTable tiers={jippyTiers} />
          </div>
        </div>
      </div>
    )
  );
};

export default Page;
