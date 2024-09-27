"use client";

import { MiniEventDTO } from "@/client";
import ArticleLoading from "@/components/news/article-loading";
import NewsArticle from "@/components/news/news-article";

interface Props {
  eventData: MiniEventDTO[] | undefined;
  isEventsLoaded: boolean;
}

const Articles = ({ eventData, isEventsLoaded }: Props) => {
  if (!isEventsLoaded) {
    return (
      <>
        <ArticleLoading />
        <ArticleLoading />
        <ArticleLoading />
      </>
    );
  }

  if (eventData!.length == 0) {
    return (
      <div className="flex w-full justify-center">
        <p className="text-sm text-offblack">
          No recent events. Try refreshing the page.
        </p>
      </div>
    );
  }

  return eventData!.map((newsEvent: MiniEventDTO, index: number) => (
    <NewsArticle key={index} newsEvent={newsEvent} />
  ));
};

export default Articles;
