import PricingTier, {
  PricingTierInfo,
} from "@/components/billing/pricing-tier";

interface PricingTiers {
  tiers: PricingTierInfo[];
}

const PricingTable = ({ tiers }: PricingTiers) => {
  return (
    <div className="mx-auto px-1 py-2 flex flex-row gap-6 items-start overflow-x-auto w-full max-w-full">
      {tiers?.length > 0 ? (
        tiers.map((tier, index) => {
          return (
            <PricingTier
              buttonText={tier.buttonText}
              className="grow basis-80 min-w-80 md:basis-64 md:min-w-64"
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
