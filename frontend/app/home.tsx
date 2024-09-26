import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { getEventsEventsGet, MiniEventDTO } from "@/client";
import ScrollToTopButton from "@/components/navigation/scroll-to-top-button";
import ArticleLoading from "@/components/news/article-loading";
import NewsArticle from "@/components/news/news-article";
import { useUpdateTopEventsPeriod } from "@/queries/user";
import { useUserStore } from "@/store/user/user-store-provider";
import { parseDate } from "@/utils/date";

const enum Period {
  Day = 1,
  Week = 7,
  Month = 30,
}

const getDisplayValueFor = (period: Period) => {
  switch (period) {
    case Period.Day:
      return "past day";
    case Period.Month:
      return "month";
    case Period.Week:
    default:
      return "week";
  }
};

const NUM_TOP_EVENTS = 10;
const DEFAULT_EVENT_PERIOD = Period.Week;

/* This component should only be rendered to authenticated users */
const Home = () => {
  const [topEvents, setTopEvents] = useState<MiniEventDTO[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedPeriod, setSelectedPeriod] =
    useState<Period>(DEFAULT_EVENT_PERIOD);

  const user = useUserStore((state) => state.user);
  const updateTopEventsMutation = useUpdateTopEventsPeriod();
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

  useEffect(() => setSelectedPeriod(eventPeriod), [eventPeriod]);

  useEffect(() => {
    const fetchTopEvents = async () => {
      setIsLoaded(false);
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

    if (user?.top_events_period) setSelectedPeriod(user.top_events_period);
    fetchTopEvents();
  }, [user, eventStartDate]);

  // Handle the option selection and close dropdown
  const handleSelection = (period: Period) => {
    if (period != selectedPeriod) {
      // Update the text
      setSelectedPeriod(period);
      updateTopEventsMutation.mutate({ timePeriod: period });
    }
    // Close dropdown
    setShowDropdown(false);
  };

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
                What happened this
              </span>
              <div className="relative">
                <button
                  className="flex items-center space-x-2 text-3xl 2xl:text-4xl font-bold hover:underline"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className="text-4xl 2xl:text-4xl font-bold text-primary-800">
                    &nbsp;{getDisplayValueFor(selectedPeriod)}
                  </span>
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
