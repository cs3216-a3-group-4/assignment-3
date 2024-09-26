import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { getEventsEventsGet, MiniEventDTO } from "@/client";
import ArticleLoading from "@/components/news/article-loading";
import NewsArticle from "@/components/news/news-article";
import { useUserStore } from "@/store/user/user-store-provider";

const NUM_TOP_EVENTS = 10;

const enum Period {
  Day = "day",
  Week = "week",
  Month = "month",
}

const PeriodMap: Record<string, number> = {
  day: 1,
  week: 7,
  month: 30,
};

/* This component should only be rendered to authenticated users */
const Home = () => {
  const [topEvents, setTopEvents] = useState<MiniEventDTO[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(Period.Week);
  const [periodInDays, setPeriodInDays] = useState<number>(
    PeriodMap[selectedPeriod],
  );
  const user = useUserStore((state) => state.user);

  const router = useRouter();
  if (!user!.categories.length) {
    router.push("/onboarding");
  }

  useEffect(() => {
    const fetchTopEvents = async () => {
      setIsLoaded(false);
      const dateNow = new Date();
      const eventStartDate = new Date(dateNow);
      eventStartDate.setDate(dateNow.getDate() - periodInDays);
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
  }, [user, periodInDays]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Handle the option selection and close dropdown
  const handleSelection = (period: Period) => {
    if (period != selectedPeriod) {
      // Update the text
      setSelectedPeriod(period);
      setPeriodInDays(PeriodMap[period]);
    }
    // Close dropdown
    setShowDropdown(false);
  };

  return (
    <div className="flex flex-col w-full py-8">
      <div className="flex flex-col mb-8 gap-y-2 mx-8 md:mx-16 xl:mx-32">
        <span className="text-sm text-muted-foreground">
          {new Date().toDateString()}
        </span>
        <div className="flex items-center gap-x-2">
          <h1 className="text-3xl 2xl:text-4xl font-bold">
            What happened this
          </h1>
          <div className="relative">
            <button
              className="flex items-center space-x-2 text-3xl 2xl:text-4xl font-bold font-bold hover:underline"
              onClick={toggleDropdown}
            >
              <span>{selectedPeriod}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showDropdown && (
              <div className="absolute mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleSelection(Period.Day)}
                  >
                    past day
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleSelection(Period.Week)}
                  >
                    week
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleSelection(Period.Month)}
                  >
                    month
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
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
