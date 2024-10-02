"use client";

import { useState } from "react";
import { SparklesIcon } from "lucide-react";

import {
  EventDTO,
  src__events__schemas__AnalysisDTO as AnalysisDTO,
} from "@/client";
import LikeButtons from "@/components/likes/like-buttons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLikeEvent } from "@/queries/like";
import { useUserStore } from "@/store/user/user-store-provider";
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
  const user = useUserStore((state) => state.user);

  const eventCategories = event.categories.map((category) =>
    getCategoryFor(category.name),
  );

  const [activeCategories, setActiveCategories] = useState<string[]>(
    event.analysises.map((item) => getCategoryFor(item.category.name)),
  );

  // @ts-expect-error deadline doesnt give me time to bother with type errors
  const analysis: { [key in Category]: AnalysisDTO } = {};

  event.analysises.forEach(
    (item) => (analysis[getCategoryFor(item.category.name)] = item),
  );

  const likeMutation = useLikeEvent(event.id);

  return (
    <div className="flex flex-col px-6 gap-y-8">
      <div className="flex flex-col gap-y-1">
        <span className="flex items-center font-medium text-3xl mb-6">
          <SparklesIcon className="inline-flex mr-3 stroke-offblack fill-muted" />
          AI-powered topical analysis
        </span>
        <div className="flex w-full">
          <ToggleGroup
            className="flex flex-col sm:flex-row flex-wrap md:flex-row gap-3"
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
        {eventCategories.map((category) => {
          const eventAnalysis = analysis[category];
          const content = eventAnalysis.content;
          const likes = eventAnalysis.likes;
          const userLike = likes.filter((like) => like.user_id == user?.id)[0];
          const userLikeValue = userLike ? userLike.type : 0;
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
                  <div>{content}</div>
                  {/* Commenting out GP questions for now */}
                  {/* <Separator className="my-4" />
                  <div>
                    How does the commercialization of global sports impact
                    societal values and economies?
                  </div> */}
                </div>
                <LikeButtons
                  onDislike={() =>
                    likeMutation.mutate({
                      analysis_id: eventAnalysis.id,
                      type: -1,
                    })
                  }
                  onLike={() =>
                    likeMutation.mutate({
                      analysis_id: eventAnalysis.id,
                      type: 1,
                    })
                  }
                  userLikeValue={userLikeValue}
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default EventAnalysis;
