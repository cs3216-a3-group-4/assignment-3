"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import Chip from "@/components/display/chip";
import { Button } from "@/components/ui/button";
import { getArticles } from "@/queries/article";
import { useUserStore } from "@/store/user/user-store-provider";
import {
  categoriesToDisplayName,
  categoriesToIconsMap,
  Category,
  getCategoryFor,
} from "@/types/categories";
import { parseDateNoYear, toQueryDate } from "@/utils/date";
import ArticlesList from "../articles/articles-list";

const ArticleFeed = () => {
  const user = useUserStore((state) => state.user);

  const eventStartDate = new Date();

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
    <div className="py-6 sm:px-8 w-full h-fit bg-card border">
      <h2 className="flex text-3xl font-semibold justify-between align-center">
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
          <div className="flex flex-col gap-2 mt-4">
            {articles.data.map((article) => (
              <div className="py-2 flex gap-2 justify-between" key={article.id}>
                <div>
                  <Link href={`/articles/${article.id}`}>
                    <h4 className="text-lg font-medium hover:underline">
                      {article.title}{" "}
                    </h4>
                  </Link>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-sm font-light mr-2">
                      {parseDateNoYear(article.date)}
                    </span>{" "}
                    {article.categories
                      ?.map((category) => getCategoryFor(category.name))
                      .map((category: Category, index: number) => (
                        <Chip
                          Icon={categoriesToIconsMap[category]}
                          key={index}
                          label={categoriesToDisplayName[category]}
                          size="sm"
                          variant="nobg"
                        />
                      ))}
                  </div>
                </div>
                <div className="w-24 flex-shrink-0">
                  <Image
                    alt={article.title}
                    height={100}
                    src={article.image_url}
                    unoptimized
                    width={100}
                  />
                </div>
              </div>
            ))}
          </div>
          <Link href="/articles">
            <Button className="sm:hidden my-4" variant={"outline"}>
              Click me to read more articles!
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default ArticleFeed;
