"use client";

import { useState } from "react";
import { SparklesIcon } from "lucide-react";

import { EventDTO } from "@/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  categoriesToDisplayName,
  categoriesToIconsMap,
  Category,
  getCategoryFor,
} from "@/types/categories";

interface Props {
  event: EventDTO;
}

const EventAnalysis = ({ event }: Props) => {
  const eventCategories = event.categories.map((category) =>
    getCategoryFor(category.name),
  );

  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  // TODO: I'm too lazy to fix this- this will be removed anyways
  // const mockAnalysis: { [key in Category]: string } = Object.freeze({
  //   [Category.Economics]: `The Singapore Grand Prix is more than just a sporting
  //           event—it’s a massive commercial and economic opportunity for
  //           the host country. The article's focus on drivers and
  //           teams overlooks how the event brings in significant tourism
  //           and investment. It also raises questions about whether such
  //           events benefit local communities or simply serve corporate
  //           interests. Formula 1's focus on big cities and luxury
  //           experiences raises the issue of whether global sports
  //           perpetuate inequality by catering to the elite rather than the
  //           masses. This ties into broader questions about the
  //           commercialization of sports and whether such events truly
  //           reflect societal values or reinforce economic disparities.`,
  //   [Category.Environment]: `Formula 1 races like the Singapore GP contribute significantly to carbon emissions, from the logistics of transporting cars and teams worldwide to the energy consumption of the race itself. This is especially critical given the global push toward sustainability and carbon reduction. Does the economic benefit of hosting such an event justify its environmental cost? How does a high-carbon sport like Formula 1 reconcile with modern pressures to move toward cleaner energy? The article can serve as a platform to debate the trade-offs between environmental sustainability and economic growth, relevant to the larger discussion of whether global events should prioritize profit over ecological impact.`,
  //   [Category.Media]: `The article frames the Singapore Grand Prix as a thrilling sports spectacle, but the role of media in glorifying these events can be critiqued. The global reach of Formula 1, amplified by media coverage, influences societal aspirations and consumption patterns, especially in emerging economies. By focusing on high-end sports like F1, the media often elevates consumerism, luxury, and elite competition, shaping cultural ideals around success and wealth. A GP essay could explore how media-driven sports influence societal values, whether by promoting hyper-competition and material success, or by sidelining more accessible, community-based activities.`,
  //   [Category.Politics]: `The Singapore GP is not just a race but a symbol of the country’s status as a global hub for commerce and luxury. Nations frequently host international sports events as a means of boosting their global image, attracting investment, and enhancing soft power. This event contributes to Singapore’s branding as an advanced, cosmopolitan nation, but it also raises questions about how much national resources should be spent on such image-building exercises. This can lead to a discussion about the role of global sports in diplomacy and whether prioritizing such events overlooks pressing domestic concerns, such as income inequality or social welfare.`,
  // });

  const analysis: { [key in Category]: string } = {};

  event.analysises.forEach(
    (item) => (analysis[getCategoryFor(item.category.name)] = item.content),
  );

  return (
    <div className="flex flex-col px-6 gap-y-8">
      <div className="flex flex-col gap-y-1">
        <span className="flex items-center font-medium text-3xl mb-6">
          <SparklesIcon className="inline-flex mr-3 stroke-offblack fill-muted" />
          AI-powered topical analysis
        </span>
        <div className="flex w-full">
          <ToggleGroup
            className="gap-3"
            onValueChange={(value) => setActiveCategories(value)}
            size="lg"
            type="multiple"
            value={activeCategories}
            variant="outline"
          >
            {eventCategories.map((category) => {
              const categoryName = categoriesToDisplayName[category];
              const CategoryIcon = categoriesToIconsMap[category];
              return (
                <ToggleGroupItem
                  aria-label={`Toggle ${categoryName}`}
                  className="border-none bg-muted text-muted-foreground data-[state=on]:bg-cyan-400/30 data-[state=on]:text-cyan-600 rounded-xl hover:bg-cyan-200/30 hover:text-cyan-500"
                  key={category}
                  value={category}
                >
                  <span className="flex items-center">
                    <CategoryIcon className="inline-flex mr-2" size={18} />
                    {categoryName}
                  </span>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>
      </div>
      <Accordion
        className="flex flex-col gap-y-6"
        onValueChange={(value) => setActiveCategories(value)}
        type="multiple"
        value={activeCategories}
      >
        {Object.entries(analysis).map((item) => {
          const [category, analysis] = item;
          const CategoryIcon = categoriesToIconsMap[category as Category];
          return (
            <AccordionItem
              className="border rounded-lg px-8 py-2 border-cyan-600/60 bg-cyan-50/30"
              key={category}
              value={category}
            >
              <AccordionTrigger
                chevronClassName="h-6 w-6 stroke-[2.5]"
                className="text-xl text-cyan-600 font-semibold"
              >
                <span className="flex items-center">
                  <CategoryIcon className="inline-flex mr-4" />
                  {categoriesToDisplayName[category as Category]}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-lg pt-2 text-cyan-950 font-[450]">
                <div>
                  <div>{analysis}</div>
                  {/* Commenting out GP questions for now */}
                  {/* <Separator className="my-4" />
                  <div>
                    How does the commercialization of global sports impact
                    societal values and economies?
                  </div> */}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default EventAnalysis;
