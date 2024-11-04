"use client";

import { useMemo } from "react";
import { CalendarIcon, CircleAlert, CircleDollarSignIcon } from "lucide-react";

import { UserPublic } from "@/client/types.gen";
import Chip from "@/components/display/chip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import JippyIconMd from "@/public/jippy-icon/jippy-icon-md";
import { useCreateStripeCustomerPortalSession } from "@/queries/billing";
import {
  JippyTier,
  JippyTierID,
  stripeSubscriptionStatusToTierStatus,
  SubscriptionPeriod,
  tierIDToPrice,
  tierIDToTierName,
} from "@/types/billing";

const MAX_CARD_HEIGHT_PX = 400;
const TIER_STATUS_ACTIVE = "active";
const UNVERIFIED_TIER_ID = 4;

export interface SubscriptionInfo {
  user: UserPublic | undefined;
}

const getDateFrom = (dateString: string | null | undefined) => {
  if (dateString) {
    return new Date(dateString);
  }
  return undefined;
};

const toPascalCase = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const SubscriptionDetail = ({
  DetailIcon,
  detailDescription,
}: {
  DetailIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  detailDescription: string;
}) => {
  return (
    <div className="flex flex-row gap-x-1 justify-start items-center">
      <DetailIcon className="w-4 h-4" />
      <div className="flex flex-row">
        <span>{detailDescription}</span>
      </div>
    </div>
  );
};

const SubscriptionCard = ({ user }: SubscriptionInfo) => {
  const currentTierName = useMemo(() => {
    return tierIDToTierName(user?.tier_id || JippyTierID.Free);
  }, [user?.tier_id]);
  const tierEndDate = useMemo(() => {
    return getDateFrom(
      user?.subscription?.subscription_ended_date ||
        user?.subscription?.subscription_period_end,
    );
  }, [user?.subscription]);
  const tierStatus = useMemo(() => {
    return toPascalCase(
      stripeSubscriptionStatusToTierStatus(
        user?.subscription ? user.subscription.status : TIER_STATUS_ACTIVE,
      ),
    );
  }, [user?.subscription]);
  const tierPrice = useMemo(() => {
    return tierIDToPrice(user?.tier_id || JippyTierID.Free);
  }, [user?.tier_id]);
  // TODO: Dynamically fetch the subscription period from Stripe if we ever support annual subscriptions
  const tierSubscriptionPeriod = SubscriptionPeriod.Month;
  const actionDescription = "Manage Subscription";

  const isUserUnverified =
    user?.verified === false || user?.tier_id === UNVERIFIED_TIER_ID;

  const stripeCustomerPortalMutation = useCreateStripeCustomerPortalSession();

  const onClickManageSubscription = () => {
    stripeCustomerPortalMutation.mutate();
  };

  return (
    <Card
      className={`flex flex-col items-stretch w-full ${isUserUnverified && "opacity-50 border-gray-400"}`}
      style={{ maxWidth: `${MAX_CARD_HEIGHT_PX}px` }}
    >
      <CardHeader className="gap-y-4">
        <CardTitle className="flex flex-row gap-x-4">
          {/* TODO: Consider one day making an icon just for Jippy-branded subscriptions */}
          <JippyIconMd />
          <span className="grow text-start">Your Jippy</span>
        </CardTitle>
        <CardDescription className="flex flex-col gap-y-2 items-stretch h-fit">
          {!isUserUnverified ? (
            <>
              <div className="flex flex-row gap-x-2 justify-start items-center">
                <span className="text-lg">{currentTierName} Tier</span>
                <Chip
                  className="w-fit"
                  label={tierStatus}
                  size="lg"
                  variant="primary"
                />
              </div>
              {user?.subscription && (
                <Button
                  className="w-fit"
                  onClick={onClickManageSubscription}
                  variant="default"
                >
                  {actionDescription}
                </Button>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-y-2">
              <span className="text-lg line-through">
                {JippyTier.Free} Tier
              </span>
              <Alert
                className="flex flex-row items-center gap-x-4"
                variant="destructive"
              >
                <div className="flex items-center flex-shrink-0">
                  <CircleAlert className="h-5 w-5 stroke-red-500" />
                </div>
                <AlertDescription className="grow">
                  Unverified email. Verify your email now to enjoy full{" "}
                  {JippyTier.Free} Tier access.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      {!isUserUnverified && (
        <>
          <hr />
          <CardContent className="flex flex-col py-2">
            <SubscriptionDetail
              DetailIcon={CircleDollarSignIcon}
              detailDescription={`$${tierPrice} per ${tierSubscriptionPeriod}`}
            />
            {tierEndDate && (
              <SubscriptionDetail
                DetailIcon={CalendarIcon}
                detailDescription={`Renews ${tierEndDate.toLocaleDateString()}`}
              />
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default SubscriptionCard;
