import Image from "next/image";
import {
  ClockIcon,
  LayoutDashboardIcon,
  NewspaperIcon,
  ZapIcon,
} from "lucide-react";

import Chip from "@/components/display/chip";
import { Separator } from "@/components/ui/separator";
import {
  categoriesToDisplayName,
  categoriesToIconsMap,
  Category,
} from "@/types/categories";

const Page = () => {
  const eventTitle = "Norris Claims Singapore GP Pole Amid Ferrari’s Setback";
  const eventDate = "21 Sep 2024";
  const newsSource = "CNA, Guardian";
  const eventCategories = [
    Category.Economics,
    Category.Environment,
    Category.Media,
    Category.Politics,
  ];

  const eventSummary =
    "In a dramatic qualifying session for the Singapore Grand Prix, Lando Norris of McLaren claimed pole position, outperforming Max Verstappen of Red Bull by just 0.155 seconds. The session was interrupted by a red flag due to a crash involving Ferrari's Carlos Sainz, which limited drivers' chances to set competitive lap times.";

  return (
    <div className="flex flex-col mx-8 md:mx-16 xl:mx-56 py-8 w-full">
      <div className="flex flex-col gap-y-10">
        <div className="flex w-full max-h-52 overflow-y-clip items-center rounded-t-2xl rounded-b-sm border">
          <Image
            alt=""
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
        <h1 className="text-3xl font-bold px-6">{eventTitle}</h1>
        <div className="flex flex-col px-6 text-sm text-muted-foreground font-medium space-y-6 md:space-y-6">
          <div className="grid grid-cols-12 gap-x-4 gap-y-3 place-items-start">
            <span className="flex items-center col-span-12 md:col-span-4 xl:col-span-3">
              <LayoutDashboardIcon
                className="inline-flex mr-2"
                size={16}
                strokeWidth={2.3}
              />
              Categories
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-2 col-span-12 md:col-span-8 xl:col-span-9">
              {eventCategories.map((category) => (
                <Chip
                  Icon={categoriesToIconsMap[category]}
                  key={category}
                  label={categoriesToDisplayName[category]}
                  variant="greygreen"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-x-4 gap-y-2 place-items-start">
            <span className="flex items-center col-span-12 md:col-span-4 xl:col-span-3">
              <ClockIcon
                className="inline-flex mr-2"
                size={16}
                strokeWidth={2.3}
              />
              Event date
            </span>
            <span className="col-span-1  md:col-span-8 xl:col-span-9 text-black">
              {eventDate}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-x-4 gap-y-2 place-items-start">
            <span className="flex items-center col-span-12 md:col-span-4 xl:col-span-3">
              <NewspaperIcon
                className="inline-flex mr-2"
                size={16}
                strokeWidth={2.3}
              />
              News source
            </span>
            <span className="col-span-1 md:col-span-8 xl:col-span-9 text-black">
              {newsSource}
            </span>
          </div>
        </div>
        <div className="flex flex-col px-6 gap-y-2">
          <span className="text-muted-foreground/60 font-medium text-sm">
            <ZapIcon className="inline-flex mr-2" size={16} strokeWidth={2} />
            AI-generated summary
          </span>
          <p>{eventSummary}</p>
        </div>
      </div>
      <Separator className="my-10" />
      <div></div>
    </div>
  );
};

export default Page;
