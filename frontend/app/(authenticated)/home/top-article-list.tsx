"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { useQuery } from "@tanstack/react-query";

import ArticlesList from "@/app/(authenticated)/articles/articles-list";
import { getTopArticles } from "@/queries/article";

import ArticleCard from "./article-card";

const TopArticleList = () => {
  const { data, isLoading } = useQuery(getTopArticles(false));
  const [singaporeOnly, setSingaporeOnly] = useState<boolean>(false);

  const numberArticles = isLoading ? undefined : data?.length;
  if (isLoading || data === undefined || numberArticles === 0) {
    return (
      <div className="w-full h-fit py-6 sm:px-8 bg-card border">
        <ArticlesList isArticlesLoaded={!isLoading} />
      </div>
    );
  }

  return (
    <div className="w-full h-fit py-6 px-8 bg-card border">
      <h2 className="flex text-lg md:text-3xl font-semibold justify-between align-center">
        This week&apos;s top articles
      </h2>
      <div className="flex items-center w-fit px-1 md:px-5 xl:px-9">
        <Select
          defaultValue={singaporeOnly ? "singapore-only" : "global"}
          onValueChange={(value) =>
            setSingaporeOnly(value === "singapore-only")
          }
        >
          <SelectTrigger
            className={
              "border-none focus:ring-0 focus:ring-offset-0 font-medium hover:bg-gray-200/40 rounded-2xl text-primary-900 text-base " +
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

      <div className="flex flex-col gap-y-2 md:mt-4">
        {data?.map((article) => (
          <ArticleCard article={article} key={article.id} />
        ))}
      </div>
    </div>
  );
};

export default TopArticleList;
