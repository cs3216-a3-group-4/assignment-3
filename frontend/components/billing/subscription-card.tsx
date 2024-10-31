import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import JippyIconMd from "@/public/jippy-icon/jippy-icon-md";
import { stripeSubscriptionStatusToTierStatus, SubscriptionPeriod } from "@/types/billing";
import { Button } from "@/components/ui/button";
import Chip from "@/components/display/chip";

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

const SubscriptionCard = ({currentTierName, tierPrice, tierStatus, tierSubscriptionPeriod, tierEndDate, actionDescription, onClickAction}: SubscriptionInfo) => {
    return (
        <Card className="flex flex-col items-stretch">
            <CardHeader className="gap-y-4">
                <CardTitle className="flex flex-row gap-x-4">
                    <JippyIconMd />
                    <span className="grow text-start">Your Jippy</span>
                </CardTitle>
                <CardDescription className="flex flex-col gap-y-2 items-stretch">
                    <div className="flex flex-row gap-x-2 justify-start">
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
                <div className="flex flex-row justify-start">
                    <span>${tierPrice}</span>
                    <span>&nbsp;per&nbsp;</span>
                    <span>{tierSubscriptionPeriod}</span>
                </div>
                { tierEndDate &&
                    <div className="flex flex-row justify-start">
                        <span>Renews </span>
                        <span>{tierEndDate.toLocaleDateString()}</span>
                    </div>
                }
            </CardContent>
        </Card>
    );
};

export default SubscriptionCard;
