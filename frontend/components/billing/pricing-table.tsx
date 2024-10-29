import PricingTier, {
  PricingTierInfo,
} from "@/components/billing/pricing-tier";

interface PricingTiers {
  tiers: PricingTierInfo[];
}

const PricingTable = ({ tiers }: PricingTiers) => {
  return (
    <div className="flex flex-col md:flex-row md:flex-wrap px-1 py-2 gap-6 justify-items-start items-stretch w-fit md:w-full">
      {tiers?.length > 0 ? (
        tiers.map((tier, index) => {
          return (
            <PricingTier
              buttonText={tier.buttonText}
              className="flex-1 min-w-80 md:min-w-64 w-full md:w-auto md:h-auto"
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
