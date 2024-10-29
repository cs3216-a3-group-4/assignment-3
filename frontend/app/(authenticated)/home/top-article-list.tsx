"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import ArticlesList from "@/app/(authenticated)/articles/articles-list";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTopArticles } from "@/queries/article";

import ArticleCard from "./article-card";

const TopArticleList = () => {
  const [singaporeOnly, setSingaporeOnly] = useState<boolean>(false);
  const { data, isLoading } = useQuery(getTopArticles(singaporeOnly));

  const numberArticles = isLoading ? undefined : data?.length;
  if (isLoading || data === undefined || numberArticles === 0) {
    return (
      <div className="w-full h-fit py-6 sm:px-8 bg-card border">
        <ArticlesList isArticlesLoaded={!isLoading} />
      </div>
    );
  }

  return (
    <div className="w-full h-fit py-1 md:py-6 px-8 bg-card border">
      <div className="flex flex-wrap justify-between">
        <h2 className="hidden md:flex text-lg md:text-3xl font-semibold align-center">
          This week&apos;s top articles
        </h2>
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
      </div>
      <div className="flex flex-col gap-y-2 md:mt-4">
        {data?.map((article) => (
          <ArticleCard article={article} key={article.id} />
        ))}
      </div>
    </div>
  );
};

export default TopArticleList;
