import { Button } from "@/components/ui/button";

export interface PricingTierInfo {
  className?: string;
  tierName: string;
  // Montly price in dollars
  price: number;
  tierDescription: string;
  tierFeatures: string[];
  isButtonDisabled?: boolean;
  buttonText?: string;
  onClickBuy?: () => void;
}

const PricingTier = ({
  className,
  tierName,
  isButtonDisabled,
  buttonText,
  onClickBuy,
  price,
  tierDescription,
  tierFeatures,
}: PricingTierInfo) => {
  const hasButton = onClickBuy && buttonText;

  return (
    <div className={`h-full ${className}`}>
      <div className="relative flex flex-col h-full p-6 rounded-2xl border border-slate-200 shadow">
        <div className={hasButton ? "mb-5" : "mb-3"}>
          <div className="text-slate-900 font-semibold mb-1">{tierName}</div>
          <div className="inline-flex items-baseline mb-2">
            <span className="text-slate-900 font-bold text-3xl">$</span>
            <span className="text-slate-900 font-bold text-4xl">{price}</span>
            <span className="text-slate-500 font-medium">/month</span>
          </div>
          {/* Ensure that tierDescription div is at least 2 lines at all times */}
          <div className={`text-sm text-slate-500 min-h-10`}>
            {tierDescription}
          </div>
          {hasButton && (
            <Button
              className="w-full inline-flex justify-center whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring transition-colors duration-150 mt-5"
              disabled={isButtonDisabled}
              onClick={onClickBuy}
            >
              {buttonText}
            </Button>
          )}
        </div>
        <div className="text-slate-900 font-medium mb-3">Includes:</div>
        <ul className="text-slate-600 text-sm space-y-3 grow">
          {tierFeatures.map((feature, index) => {
            return (
              <li className="flex items-center" key={index}>
                <svg
                  className="w-3 h-3 fill-emerald-500 mr-3 shrink-0"
                  viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                </svg>
                <span>{feature}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PricingTier;
