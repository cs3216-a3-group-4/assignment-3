export interface PricingTierInfo {
    tierName: string;
    isPurchased: boolean;
    onClickBuy: () => void;
    // Montly price in dollars
    price: number;
    tierDescription: string;
    tierFeatures: string[];
};

export enum JippyTier {
    Free = "Free",
    Premium = "Premium",
    Enterprise = "Enterprise",
};

export enum JippyTierID {
    Free = 1,
    Premium = 2,
    Enterprise = 3,
};

export enum TierPrice {
    Free = 0,
    Premium = 3.49,
    Enterprise = 26.18,
};

export const tierIDToTierName = (tierID: number): string => {
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
