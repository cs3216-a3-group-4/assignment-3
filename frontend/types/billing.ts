export const UNVERIFIED_TIER_ID = 4;

export enum JippyTier {
  Free = "Free",
  Premium = "Premium",
  Enterprise = "Enterprise",
}

export enum JippyTierID {
  Free = 1,
  Premium = 2,
  Enterprise = 3,
}

export enum JippyTierStatus {
  Active = "active",
  Paused = "paused",
  Cancelled = "cancelled",
  Expired = "expired",
  Unknown = "",
}

export enum SubscriptionPeriod {
  Month = "month",
  Year = "year",
}

export enum TierPrice {
  Free = 0,
  Premium = 3.49,
  Enterprise = 26.18,
}

/**
 * Parses a Stripe subscription status and returns a user-friendly Jippy tier status string
 */
export const stripeSubscriptionStatusToTierStatus = (status: string): JippyTierStatus => {
  switch (status) {
    case "active":
      return JippyTierStatus.Active;
    case "paused":
      return JippyTierStatus.Paused;
    case "canceled":
      return JippyTierStatus.Cancelled;
    case "past_due":
      return JippyTierStatus.Expired;
    default:
      return JippyTierStatus.Unknown;
  }
};

export const tierIDToPrice = (tierID: JippyTierID): number => {
  switch (tierID) {
    case JippyTierID.Free:
      return TierPrice.Free;
    case JippyTierID.Premium:
      return TierPrice.Premium;
    case JippyTierID.Enterprise:
      return TierPrice.Enterprise;
    default:
      return 0;
  }
};

export const tierIDToTierName = (tierID: JippyTierID): string => {
  switch (tierID) {
    case JippyTierID.Free:
      return JippyTier.Free;
    case JippyTierID.Premium:
      return JippyTier.Premium;
    case JippyTierID.Enterprise:
      return JippyTier.Enterprise;
    default:
      return "Others";
  }
};

export const tierIDToTierDescription: Record<JippyTierID, string> = {
  [JippyTierID.Free]: "Basic features for GP revision",
  [JippyTierID.Premium]: "Enhanced features to bolster your GP revision",
  [JippyTierID.Enterprise]: "Coming soon",
};

export const tierIDToTierFeature: Record<JippyTierID, string[]> = {
  [JippyTierID.Free]: [
    "See all events and summaries",
    "Unlimited notes with annotation and highlighting",
    "View up to 20 event analyses per week",
    "3 GP essay content generation per week",
  ],
  [JippyTierID.Premium]: [
    "All of the Free features",
    "10 GP essay content generation per week",
    "3 free essay feedback per week",
  ],
  [JippyTierID.Enterprise]: ["Coming soon"],
};
