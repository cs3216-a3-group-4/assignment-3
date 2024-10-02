"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import ScrollToTopButton from "@/components/navigation/scroll-to-top-button";
import ArticleLoading from "@/components/news/article-loading";
import NewsArticle from "@/components/news/news-article";
import { useUserStore } from "@/store/user/user-store-provider";
import { parseDate, toQueryDate } from "@/utils/date";
import usePagination from "@/hooks/use-pagination";
import Pagination from "@/components/navigation/pagination";
import { getHomeEvents } from "@/queries/event";
import { useQuery } from "@tanstack/react-query";
import DateRangeSelector, { Period } from "@/app/_home/date-range-selector";

const DEFAULT_EVENT_PERIOD = Period.Week;

/* This component should only be rendered to authenticated users */
const Home = () => {
  const [totalEventCount, setTotalEventCount] = useState<number | undefined>(
    undefined,
  );

  const [selectedPeriod, setSelectedPeriod] =
    useState<Period>(DEFAULT_EVENT_PERIOD);

  const { page, pageCount, getPageUrl } = usePagination({
    totalCount: totalEventCount,
  });
  const user = useUserStore((state) => state.user);

  const router = useRouter();

  const eventPeriod = useMemo(
    () =>
      user?.top_events_period ? user.top_events_period : DEFAULT_EVENT_PERIOD,
    [user?.top_events_period],
  );

  const eventStartDate = useMemo(() => {
    const eventStartDate = new Date();
    eventStartDate.setDate(eventStartDate.getDate() - eventPeriod);
    return eventStartDate;
  }, [eventPeriod]);

  const { data: events, isSuccess: isEventsLoaded } = useQuery(
    getHomeEvents(
      toQueryDate(eventStartDate),
      page,
      user?.categories.map((category) => category.id),
    ),
  );

  useEffect(() => setSelectedPeriod(eventPeriod), [eventPeriod]);

  useEffect(() => {
    if (user?.top_events_period) setSelectedPeriod(user.top_events_period);
  }, [user]);

  useEffect(
    () => setTotalEventCount(events?.total_count),
    [events?.total_count],
  );

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
            className="flex flex-col mb-4 gap-y-2 px-4 md:px-8 xl:px-12"
            id="homePage"
          >
            <div className="flex">
              <span className="text-4xl 2xl:text-4xl font-bold text-primary-800">
                What happened this&nbsp;
              </span>
              <DateRangeSelector
                selectedPeriod={selectedPeriod}
                setSelectedPeriod={setSelectedPeriod}
              />
            </div>
            <span className="text-primary text-lg">
              {parseDate(eventStartDate)} - {parseDate(new Date())}
            </span>
          </div>

          <div className="flex flex-col w-full">
            {!isEventsLoaded ? (
              <div className="flex flex-col w-full">
                <ArticleLoading />
                <ArticleLoading />
                <ArticleLoading />
              </div>
            ) : (
              events?.data.map((newsEvent, index) => (
                <NewsArticle key={index} newsEvent={newsEvent} />
              ))
            )}
          </div>
          {isEventsLoaded && (
            <Pagination
              page={page}
              pageCount={pageCount}
              getPageUrl={getPageUrl}
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
