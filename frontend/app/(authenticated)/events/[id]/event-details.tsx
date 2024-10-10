import { ClockIcon, LayoutDashboardIcon, NewspaperIcon } from "lucide-react";

import { EventDTO } from "@/client";
import Chip from "@/components/display/chip";
import {
  categoriesToDisplayName,
  categoriesToIconsMap,
  getCategoryFor,
} from "@/types/categories";
import { parseDate } from "@/utils/date";
import CategoryChip from "@/components/display/category-chip";

interface Props {
  event: EventDTO;
}

const EventDetails = ({ event }: Props) => {
  const eventCategories = event.categories.map((category) =>
    getCategoryFor(category.name),
  );

  return (
    <div className="flex flex-col px-6 text-muted-foreground font-[450] space-y-4 md:space-y-4">
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
            <CategoryChip category={category} />
          ))}
        </div>
      </div>

      <div className="hidden md:grid grid-cols-12 gap-x-4 gap-y-2 place-items-start">
        <span className="flex items-center col-span-12 md:col-span-4 xl:col-span-3">
          <ClockIcon className="inline-flex mr-2" size={16} strokeWidth={2.3} />
          Event date
        </span>
        <span className="col-span-10  md:col-span-8 xl:col-span-9 text-black font-normal">
          {parseDate(event.date)}
        </span>
      </div>
      <div className="flex gap-2 md:hidden">
        <span className="flex items-center col-span-12 md:col-span-4 xl:col-span-3">
          <ClockIcon className="inline-flex mr-2" size={16} strokeWidth={2.3} />
          Event date
        </span>
        <span className="col-span-10  md:col-span-8 xl:col-span-9 text-black font-normal">
          {parseDate(event.date)}
        </span>
      </div>

      <div className="hidden md:grid grid-cols-12 gap-x-4 gap-y-2 place-items-start">
        <span className="flex items-center col-span-12 md:col-span-4 xl:col-span-3">
          <NewspaperIcon
            className="inline-flex mr-2"
            size={16}
            strokeWidth={2.3}
          />
          News source
        </span>
        <span className="col-span-1 md:col-span-8 xl:col-span-9 text-black font-normal">
          <a className="underline" href={event.original_article.url}>
            {event.original_article.source.replace("GUARDIAN", "Guardian")}
          </a>
        </span>
      </div>

      <div className="flex gap-2 md:hidden">
        <span className="flex items-center col-span-12 md:col-span-4 xl:col-span-3">
          <NewspaperIcon
            className="inline-flex mr-2"
            size={16}
            strokeWidth={2.3}
          />
          News source
        </span>
        <span className="col-span-1 md:col-span-8 xl:col-span-9 text-black font-normal">
          <a className="underline" href={event.original_article.url}>
            {event.original_article.source.replace("GUARDIAN", "Guardian")}
          </a>
        </span>
      </div>
    </div>
  );
};

export default EventDetails;
