import { EventIndexResponse } from "@/client";
import ArticleLoading from "@/components/news/article-loading";
import NewsArticle from "@/components/news/news-article";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EventsListProps {
  isEventsLoaded: boolean;
  events?: EventIndexResponse;
}

const EventsList = ({ isEventsLoaded, events }: EventsListProps) => {
  if (!isEventsLoaded) {
    return (
      <div className="flex flex-col w-full">
        <ArticleLoading />
        <ArticleLoading />
        <ArticleLoading />
      </div>
    );
  }

  if (events === undefined || events.total_count === 0) {
    return (
      <div className="flex flex-col w-full px-4 md:px-8 xl:px-12 mt-4">
        <Alert className="bg-gray-200/40 text-gray-700 border-none px-8 py-4">
          <AlertTitle className="text-xl font-semibold">
            Uh oh... Jippy couldn&apos;t find any events
          </AlertTitle>
          <AlertDescription className="text-base">
            Jippy&apos;s probably busy reading newspapers to find more events.
            Maybe check back soon?
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {events.data.map((newsEvent, index) => (
        <NewsArticle key={index} newsEvent={newsEvent} />
      ))}
    </div>
  );
};

export default EventsList;
