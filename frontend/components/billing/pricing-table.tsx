import PricingTier, {
  PricingTierInfo,
} from "@/components/billing/pricing-tier";

interface PricingTiers {
  tiers: PricingTierInfo[];
}

const PricingTable = ({ tiers }: PricingTiers) => {
  return (
    <div className="max-w-sm mx-auto grid gap-6 lg:grid-cols-3 items-start lg:max-w-none">
      {tiers?.length > 0 ? (
        tiers.map((tier, index) => {
          return (
            <PricingTier
              buttonText={tier.buttonText}
              isButtonDisabled={tier.isButtonDisabled}
              key={index}
              onClickBuy={tier.onClickBuy}
              price={tier.price}
              tierDescription={tier.tierDescription}
              tierFeatures={tier.tierFeatures}
              tierName={tier.tierName}
            />
          );
        })
      ) : (
        <div className="text-center text-slate-500 dark:text-slate-400">
          No pricing tiers available
        </div>
      )}
    </div>
  );
};

export default PricingTable;
