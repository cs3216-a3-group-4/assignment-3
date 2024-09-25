import Image from "next/image";

import { Separator } from "@/components/ui/separator";

import EventAnalysis from "./event-analysis";
import EventDetails from "./event-details";
import EventSource from "./event-source";
import EventSummary from "./event-summary";

const Page = () => {
  // TODO: dynamically fetch
  const eventTitle = "Norris Claims Singapore GP Pole Amid Ferrari’s Setback";
  return (
    <div className="flex flex-col mx-8 md:mx-16 xl:mx-56 py-8 w-full h-fit">
      <div className="flex flex-col gap-y-10">
        <div className="flex w-full max-h-52 overflow-y-clip items-center rounded-t-2xl rounded-b-sm border">
          <Image
            alt={eventTitle}
            height={154}
            src="https://onecms-res.cloudinary.com/image/upload/s--893X2dru--/c_fill,g_auto,h_468,w_830/fl_relative,g_south_east,l_mediacorp:cna:watermark:2021-08:cna,w_0.1/f_auto,q_auto/v1/mediacorp/cna/image/2024/09/21/RAY_3553.JPG?itok=aFJ8bcqO"
            style={{
              width: "100%",
              height: "fit-content",
            }}
            unoptimized
            width={273}
          />
        </div>
        <h1 className="text-4xl font-bold px-6">{eventTitle}</h1>
        <EventDetails />
        <EventSummary />
      </div>
      <Separator className="my-10" />
      <EventAnalysis />
      <Separator className="my-10" />
      <EventSource />
    </div>
  );
};

export default Page;
