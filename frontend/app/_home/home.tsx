"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import DateRangeSelector, { Period } from "@/app/_home/date-range-selector";
import EventsList from "@/app/_home/events-list";
import Pagination from "@/components/navigation/pagination";
import ScrollToTopButton from "@/components/navigation/scroll-to-top-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import usePagination from "@/hooks/use-pagination";
import { getHomeEvents } from "@/queries/event";
import { useUserStore } from "@/store/user/user-store-provider";
import { parseDate, toQueryDate } from "@/utils/date";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_EVENT_PERIOD = Period.Week;

/* This component should only be rendered to authenticated users */
const Home = () => {
  const user = useUserStore((state) => state.user);

  const eventPeriod = user?.top_events_period
    ? user.top_events_period
    : DEFAULT_EVENT_PERIOD;

  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);

  const { page, pageCount, getPageUrl } = usePagination({
    totalCount,
  });

  const eventStartDate = useMemo(() => {
    const eventStartDate = new Date();
    eventStartDate.setDate(eventStartDate.getDate() - eventPeriod);
    return eventStartDate;
  }, [eventPeriod]);

  const [singaporeOnly, setSingaporeOnly] = useState<boolean>(false);

  const { data: events, isSuccess: isEventsLoaded } = useQuery(
    getHomeEvents(
      toQueryDate(eventStartDate),
      page,
      singaporeOnly,
      user?.categories.map((category) => category.id),
    ),
  );

  useEffect(() => {
    setTotalCount(events?.total_count);
  }, [events?.total_count]);

  const router = useRouter();

  if (!user!.categories.length) {
    router.push("/onboarding");
  }

  return (
    <div className="relative w-full h-full">
      <div
        className="flex bg-muted w-full h-full max-h-full py-8 overflow-y-auto"
        id="home-page"
      >
        <div className="flex flex-col py-6 lg:py-12 w-full h-fit mx-4 md:mx-8 xl:mx-24 bg-background rounded-lg border border-border px-8">
          {/* TODO: x-padding here is tied to the news article */}
          <div
            className="flex flex-col mb-2 gap-y-2 px-4 md:px-8 xl:px-12"
            id="homePage"
          >
            <div>
              <span className="text-4xl 2xl:text-4xl font-bold text-primary-800">
                What happened this&nbsp;
              </span>
              <DateRangeSelector selectedPeriod={eventPeriod} />
            </div>
            <span className="text-primary text-lg">
              {parseDate(eventStartDate)} - {parseDate(new Date())}
            </span>
          </div>
          <div className="flex items-center w-fit px-1 md:px-5 xl:px-9">
            <Select
              defaultValue="global"
              onValueChange={(value) =>
                setSingaporeOnly(value === "singapore-only")
              }
            >
              <SelectTrigger
                className={
                  "border-none focus:ring-0 focus:ring-offset-0 font-medium hover:bg-gray-200/40 rounded-2xl text-primary-900 text-base " +
                  (singaporeOnly ? "w-[125px]" : "w-[105px]")
                }
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="min-w-[9rem]">
                <SelectGroup>
                  <SelectLabel className="text-base">Event filter</SelectLabel>
                  <SelectItem value="global" className="text-base">
                    Global
                  </SelectItem>
                  <SelectItem value="singapore-only" className="text-base">
                    Singapore
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <EventsList events={events} isEventsLoaded={isEventsLoaded} />

          {isEventsLoaded && (
            <Pagination
              getPageUrl={getPageUrl}
              page={page}
              pageCount={pageCount}
            />
          )}
        </div>
      </div>
      <ScrollToTopButton
        className="absolute right-4 bottom-4"
        minHeight={200}
        scrollElementId="home-page"
      />
    </div>
  );
};

export default Home;
