import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import JippyIconMd from "@/public/jippy-icon/jippy-icon-md";
import { stripeSubscriptionStatusToTierStatus, SubscriptionPeriod } from "@/types/billing";
import { Button } from "@/components/ui/button";
import Chip from "@/components/display/chip";
import { CalendarIcon, CircleDollarSignIcon } from "lucide-react";

const MAX_CARD_HEIGHT_PX = 400;

export interface SubscriptionInfo {
    currentTierName: string;
    // Montly price in dollars
    tierPrice: number;
    tierStatus: string;
    tierSubscriptionPeriod: SubscriptionPeriod;
    tierEndDate?: Date;
    actionDescription?: string;
    onClickAction?: () => void;
};

const toPascalCase = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const SubscriptionDetail = ({DetailIcon, detailDescription}: { DetailIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>, detailDescription: string }) => {
    return (
        <div className="flex flex-row gap-x-1 justify-start items-center">
            <DetailIcon className="w-4 h-4" />
            <div className="flex flex-row">
                <span>{detailDescription}</span>
            </div>
        </div>
    )
}

const SubscriptionCard = ({currentTierName, tierPrice, tierStatus, tierSubscriptionPeriod, tierEndDate, actionDescription, onClickAction}: SubscriptionInfo) => {
    return (
        <Card className="flex flex-col items-stretch w-full" style={{ maxWidth: `${MAX_CARD_HEIGHT_PX}px` }}>
            <CardHeader className="gap-y-4">
                <CardTitle className="flex flex-row gap-x-4">
                    {/* TODO: Consider one day making an icon just for Jippy-branded subscriptions */}
                    <JippyIconMd />
                    <span className="grow text-start">Your Jippy</span>
                </CardTitle>
                <CardDescription className="flex flex-col gap-y-2 items-stretch h-fit">
                    <div className="flex flex-row gap-x-2 justify-start items-center">
                        <span className="text-lg">{currentTierName} Tier</span>
                        <Chip
                            className="w-fit"
                            label={toPascalCase(stripeSubscriptionStatusToTierStatus(tierStatus))}
                            size="lg"
                            variant="primary"
                        />
                    </div>
                    { actionDescription && onClickAction &&
                        <Button className="w-fit" onClick={onClickAction} variant="default">
                            Manage Subscription
                        </Button>
                    }
                </CardDescription>
            </CardHeader>
            <hr />
            <CardContent className="flex flex-col py-2">
                <SubscriptionDetail
                    DetailIcon={CircleDollarSignIcon}
                    detailDescription={`$${tierPrice} per ${tierSubscriptionPeriod}`} />
                { tierEndDate &&
                    <SubscriptionDetail
                        DetailIcon={CalendarIcon}
                        detailDescription={`Renews ${tierEndDate.toLocaleDateString()}`}
                    />
                }
            </CardContent>
        </Card>
    );
};

export default SubscriptionCard;
