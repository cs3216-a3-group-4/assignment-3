import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getEventsEventsGet, MiniEventDTO } from "@/client";
import ArticleLoading from "@/components/news/article-loading";
import NewsArticle from "@/components/news/news-article";
import { useUserStore } from "@/store/user/user-store-provider";

const NUM_TOP_EVENTS = 10;
const DAYS_PER_WEEK = 7;

/* This component should only be rendered to authenticated users */
const Home = () => {
  const [topEvents, setTopEvents] = useState<MiniEventDTO[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const user = useUserStore((state) => state.user);

  const router = useRouter();
  if (!user!.categories.length) {
    router.push("/onboarding");
  }

  useEffect(() => {
    const fetchTopEvents = async () => {
      const dateNow = new Date();
      const eventStartDate = new Date(dateNow);
      eventStartDate.setDate(dateNow.getDate() - DAYS_PER_WEEK);
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
  }, [user]);

  return (
    <div className="flex flex-col w-full py-8">
      <div className="flex flex-col mb-8 gap-y-2 mx-8 md:mx-16 xl:mx-32">
        <span className="text-sm text-muted-foreground">
          {new Date().toDateString()}
        </span>
        <h1 className="text-3xl 2xl:text-4xl font-bold">
          What happened this week
        </h1>
      </div>

      <div className="flex flex-col w-auto mx-4 md:mx-8 xl:mx-24">
        {!isLoaded ? (
          <>
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
          </>
        ) : (
          topEvents.map((newsEvent: MiniEventDTO, index: number) => (
            <NewsArticle key={index} newsEvent={newsEvent} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
