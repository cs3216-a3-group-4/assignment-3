"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import ArticlesList from "@/app/(authenticated)/articles/articles-list";
import { Button } from "@/components/ui/button";
import { getArticles } from "@/queries/article";
import { useUserStore } from "@/store/user/user-store-provider";
import { toQueryDate } from "@/utils/date";

import ArticleCard from "./article-card";

const ArticleFeed = () => {
  const user = useUserStore((state) => state.user);

  const eventStartDate = new Date("11 september 2024");

  eventStartDate.setDate(eventStartDate.getDate() - 1);

  const { data: articles, isLoading } = useQuery(
    getArticles(
      toQueryDate(eventStartDate),
      10,
      false,
      user?.categories.map((category) => category.id),
    ),
  );

  const numberArticles = isLoading ? undefined : articles?.count;
  if (isLoading || articles === undefined || numberArticles === 0) {
    return (
      <div className="w-full h-fit py-6 sm:px-8 bg-card border">
        <ArticlesList isArticlesLoaded={!isLoading} />
      </div>
    );
  }

  return (
    <div className="md:py-6 px-8 w-full h-fit bg-card border">
      <h2 className="hidden md:flex text-lg md:text-3xl font-semibold justify-between align-center">
        <span className="flex gap-2 items-baseline text-primary-800">
          Today&apos;s articles for you
        </span>
        <Link href="/articles">
          <Button className="hidden sm:flex" variant={"outline"}>
            Read more
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </h2>
      {!isLoading && articles?.data && (
        <>
          <div className="flex flex-col gap-y-2 md:mt-4">
            {articles.data.map((article) => (
              <ArticleCard article={article} />
            ))}
          </div>
          <Link href="/articles">
            <Button className="sm:hidden my-4" variant={"outline"}>
              More articles
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default ArticleFeed;
