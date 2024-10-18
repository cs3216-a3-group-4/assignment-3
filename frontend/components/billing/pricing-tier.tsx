import { isPrefixUnaryExpression } from "typescript";
import { Button } from "@/components/ui/button";
import { PricingTierInfo } from "@/types/billing";

const PricingTier = ({tierName, isPurchased, onClickBuy, price, tierDescription, tierFeatures}: PricingTierInfo) => {
    return (
        <div className="h-full">
            <div className="relative flex flex-col h-full p-6 rounded-2xl border border-slate-200 shadow ">
                <div className="mb-5">
                <div className="text-slate-900 font-semibold mb-1">{tierName}</div>
                <div className="inline-flex items-baseline mb-2">
                    <span className="text-slate-900 font-bold text-3xl">$</span>
                    <span className="text-slate-900 font-bold text-4xl">{price}</span>
                    <span className="text-slate-500 font-medium">/month</span>
                </div>
                <div className="text-sm text-slate-500 h-16 mb-5">{tierDescription}</div>
                <Button className="w-full inline-flex justify-center whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring transition-colors duration-150" disabled={isPurchased} onClick={onClickBuy}>
                    {isPurchased ? "Bought" : "Buy"}
                </Button>
                </div>
                <div className="text-slate-900 font-medium mb-3">Includes:</div>
                <ul className="text-slate-600 text-sm space-y-3 grow">
                {tierFeatures.map((feature, index) => {
                    return (
                    <li key={index} className="flex items-center">
                        <svg className="w-3 h-3 fill-emerald-500 mr-3 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                        </svg>
                        <span>{feature}</span>
                    </li>
                    )
                })}
                </ul>
            </div>
        </div>
    );
};

export default PricingTier;
