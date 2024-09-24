import { ZapIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const EventSummary = () => {
  // TODO: dynamically fetch or pass down as prop
  const eventSummary =
    "In a dramatic qualifying session for the Singapore Grand Prix, Lando Norris of McLaren claimed pole position, outperforming Max Verstappen of Red Bull by just 0.155 seconds.";
  return (
    <div className="px-6">
      <Alert variant="teal">
        <div className="flex items-center mb-2">
          <ZapIcon className="stroke-teal-700 fill-teal-700 mr-3" size={20} />
          <AlertTitle className="text-teal-700 text-lg mb-0">
            AI-generated summary
          </AlertTitle>
        </div>
        <AlertDescription className="text-lg font-[450]">
          {eventSummary}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default EventSummary;
