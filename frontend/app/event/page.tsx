import Image from "next/image";
import {
  Bold,
  ClockIcon,
  Italic,
  LayoutDashboardIcon,
  NewspaperIcon,
  SparkleIcon,
  SparklesIcon,
  Underline,
  ZapIcon,
} from "lucide-react";

import Chip from "@/components/display/chip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  categoriesToDisplayName,
  categoriesToIconsMap,
  Category,
} from "@/types/categories";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  const mockAnalysis: { [key in Category]: string } = Object.freeze({
    [Category.Economics]: `The Singapore Grand Prix is more than just a sporting
        event—it’s a massive commercial and economic opportunity for
        the host country. The article's focus on drivers and
        teams overlooks how the event brings in significant tourism
        and investment. It also raises questions about whether such
        events benefit local communities or simply serve corporate
        interests. Formula 1's focus on big cities and luxury
        experiences raises the issue of whether global sports
        perpetuate inequality by catering to the elite rather than the
        masses. This ties into broader questions about the
        commercialization of sports and whether such events truly
        reflect societal values or reinforce economic disparities.`,
    [Category.Environment]: `Formula 1 races like the Singapore GP contribute significantly to carbon emissions, from the logistics of transporting cars and teams worldwide to the energy consumption of the race itself. This is especially critical given the global push toward sustainability and carbon reduction. Does the economic benefit of hosting such an event justify its environmental cost? How does a high-carbon sport like Formula 1 reconcile with modern pressures to move toward cleaner energy? The article can serve as a platform to debate the trade-offs between environmental sustainability and economic growth, relevant to the larger discussion of whether global events should prioritize profit over ecological impact.`,
    [Category.Media]: `The article frames the Singapore Grand Prix as a thrilling sports spectacle, but the role of media in glorifying these events can be critiqued. The global reach of Formula 1, amplified by media coverage, influences societal aspirations and consumption patterns, especially in emerging economies. By focusing on high-end sports like F1, the media often elevates consumerism, luxury, and elite competition, shaping cultural ideals around success and wealth. A GP essay could explore how media-driven sports influence societal values, whether by promoting hyper-competition and material success, or by sidelining more accessible, community-based activities.`,
    [Category.Politics]: `The Singapore GP is not just a race but a symbol of the country’s status as a global hub for commerce and luxury. Nations frequently host international sports events as a means of boosting their global image, attracting investment, and enhancing soft power. This event contributes to Singapore’s branding as an advanced, cosmopolitan nation, but it also raises questions about how much national resources should be spent on such image-building exercises. This can lead to a discussion about the role of global sports in diplomacy and whether prioritizing such events overlooks pressing domestic concerns, such as income inequality or social welfare.`,
  });

  const eventSummary =
    "In a dramatic qualifying session for the Singapore Grand Prix, Lando Norris of McLaren claimed pole position, outperforming Max Verstappen of Red Bull by just 0.155 seconds.";

  return (
    <div className="flex flex-col mx-8 md:mx-16 xl:mx-56 py-8 w-full h-fit">
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
            <span className="col-span-1  md:col-span-8 xl:col-span-9 text-black font-normal">
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
            <span className="col-span-1 md:col-span-8 xl:col-span-9 text-black font-normal">
              {newsSource}
            </span>
          </div>
        </div>
        <div className="px-6">
          <Alert variant="yellow">
            <ZapIcon className="h-4 w-4 stroke-lime-700" />
            <AlertTitle className="text-lime-700 mb-2">
              AI-generated summary
            </AlertTitle>
            <AlertDescription className="text-base font-[450]">
              {eventSummary}
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <Separator className="my-10" />
      <div className="flex flex-col px-6 gap-y-4">
        <div className="flex flex-col gap-y-1">
          <span className="flex items-center font-medium text-2xl mb-4">
            <SparklesIcon
              className="inline-flex mr-3 stroke-offblack fill-muted"
              size={24}
            />
            AI-powered topical analysis
          </span>
          <div className="flex w-full">
            <ToggleGroup
              type="multiple"
              size="xs"
              className="gap-3"
              variant="outline"
            >
              {eventCategories.map((category) => {
                const categoryName = categoriesToDisplayName[category];
                const CategoryIcon = categoriesToIconsMap[category];
                return (
                  <ToggleGroupItem
                    value={category}
                    className="border-none bg-muted text-muted-foreground data-[state=on]:bg-orange-400/10 data-[state=on]:text-orange-600 rounded-xl hover:bg-orange-200/10 hover:text-orange-400"
                    aria-label={`Toggle ${categoryName}`}
                  >
                    <span className="flex items-center">
                      <CategoryIcon size={18} className="inline-flex mr-2" />
                      {categoryName}
                    </span>
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </div>
        </div>
        <Accordion type="multiple">
          {Object.entries(mockAnalysis).map((item) => {
            const [category, analysis] = item;
            return (
              <AccordionItem value={category}>
                <AccordionTrigger className="text-lg">
                  {categoriesToDisplayName[category as Category]}
                </AccordionTrigger>
                <AccordionContent>
                  <div>
                    <div>{analysis}</div>
                    <div>
                      How does the commercialization of global sports impact
                      societal values and economies?
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};

export default Page;
