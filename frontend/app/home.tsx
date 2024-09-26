import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { getEventsEventsGet, MiniEventDTO } from "@/client";
import ScrollToTopButton from "@/components/navigation/scroll-to-top-button";
import ArticleLoading from "@/components/news/article-loading";
import NewsArticle from "@/components/news/news-article";
import { useUserStore } from "@/store/user/user-store-provider";
import { parseDate } from "@/utils/date";

const NUM_TOP_EVENTS = 10;
const DAYS_PER_WEEK = 7;

/* This component should only be rendered to authenticated users */
const Home = () => {
  const eventStartDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - DAYS_PER_WEEK);
    return date;
  }, []);

  const [topEvents, setTopEvents] = useState<MiniEventDTO[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const user = useUserStore((state) => state.user);

  const router = useRouter();
  if (!user!.categories.length) {
    router.push("/onboarding");
  }

  useEffect(() => {
    const fetchTopEvents = async () => {
      const formattedEventStartDate = eventStartDate
        .toISOString()
        .split("T")[0];

      let eventQuery;
      if (user?.categories && user.categories.length > 0) {
        eventQuery = {
          query: {
            start_date: formattedEventStartDate,
            limit: NUM_TOP_EVENTS,
            category_ids: user.categories.map((category) => category.id),
          },
        };
      } else {
        eventQuery = {
          query: {
            start_date: formattedEventStartDate,
            limit: NUM_TOP_EVENTS,
          },
        };
      }
      const response = await getEventsEventsGet(eventQuery);

      if (response.error) {
        console.log(response.error);
      } else {
        setTopEvents(response.data.data);
        setIsLoaded(true);
      }
    };

    fetchTopEvents();
  }, [user, eventStartDate]);

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
            <h1 className="text-4xl 2xl:text-4xl font-bold text-primary-800">
              What happened this week
            </h1>
            <span className="text-primary text-lg">
              {parseDate(eventStartDate)} - {parseDate(new Date())}
            </span>
          </div>

          <div className="flex flex-col w-full">
            {!isLoaded ? (
              <div className="flex flex-col w-full">
                <ArticleLoading />
                <ArticleLoading />
                <ArticleLoading />
              </div>
            ) : (
              topEvents.map((newsEvent: MiniEventDTO, index: number) => (
                <NewsArticle key={index} newsEvent={newsEvent} />
              ))
            )}
          </div>
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
