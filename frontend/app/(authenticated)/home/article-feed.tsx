"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import ArticlesList from "@/app/(authenticated)/articles/articles-list";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getArticles } from "@/queries/article";
import { useUserStore } from "@/store/user/user-store-provider";
import { toQueryDate } from "@/utils/date";

import ArticleCard from "./article-card";

const ArticleFeed = () => {
  const user = useUserStore((state) => state.user);
  const [singaporeOnly, setSingaporeOnly] = useState<boolean>(false);

  const eventStartDate = new Date();

  eventStartDate.setDate(eventStartDate.getDate() - 1);

  const { data: articles, isLoading } = useQuery(
    getArticles(
      toQueryDate(eventStartDate),
      10,
      singaporeOnly,
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
        <div className="flex items-center w-fit">
          <Select
            defaultValue={singaporeOnly ? "singapore-only" : "global"}
            onValueChange={(value) =>
              setSingaporeOnly(value === "singapore-only")
            }
          >
            <SelectTrigger
              className={
                "border-none focus:ring-0 focus:ring-offset-0 font-medium hover:bg-gray-200/40 rounded-2xl text-primary-900 text-base !h-fit pl-2 -ml-2 mt-2 md:-ml-1 lg:ml-0 md:mt-0 -mb-4 md:mb-0 sm:pl-3 sm:!h-10 " +
                (singaporeOnly ? "w-[125px]" : "w-[105px]")
              }
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="min-w-[9rem]">
              <SelectGroup>
                <SelectLabel className="text-base">Article filter</SelectLabel>
                <SelectItem className="text-base" value="global">
                  Global
                </SelectItem>
                <SelectItem className="text-base" value="singapore-only">
                  Singapore
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </h2>
      <div className="flex items-center md:hidden w-fit">
        <Select
          defaultValue={singaporeOnly ? "singapore-only" : "global"}
          onValueChange={(value) =>
            setSingaporeOnly(value === "singapore-only")
          }
        >
          <SelectTrigger
            className={
              "border-none focus:ring-0 focus:ring-offset-0 font-medium hover:bg-gray-200/40 rounded-2xl text-primary-900 text-base !h-fit pl-2 -ml-2 mt-2 md:-ml-1 lg:ml-0 md:mt-0 -mb-4 md:mb-0 sm:pl-3 sm:!h-10 " +
              (singaporeOnly ? "w-[125px]" : "w-[105px]")
            }
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="min-w-[9rem]">
            <SelectGroup>
              <SelectLabel className="text-base">Article filter</SelectLabel>
              <SelectItem className="text-base" value="global">
                Global
              </SelectItem>
              <SelectItem className="text-base" value="singapore-only">
                Singapore
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {!isLoading && articles?.data && (
        <>
          <div className="flex flex-col gap-y-2 md:mt-4">
            {articles.data.map((article) => (
              <ArticleCard article={article} key={article.id} />
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
      <Link href="/articles">
        <Button className="hidden sm:flex mt-4 w-full" variant={"outline"}>
          Read more
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
};

export default ArticleFeed;
