"use client";

import { useState } from "react";
import Link from "next/link";
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

import Chip from "@/components/display/chip";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getTopArticles } from "@/queries/article";
import {
  categoriesToDisplayName,
  categoriesToIconsMap,
  Category,
  getCategoryFor,
} from "@/types/categories";

const TopArticleList = () => {
  const { data, isLoading } = useQuery(getTopArticles(false));
  const [singaporeOnly, setSingaporeOnly] = useState<boolean>(false);
  return (
    <div className="w-full">
      <h2 className="flex text-3xl font-semibold">
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
      {isLoading && <LoadingSpinner className="w-24 h-24" />}
      {!isLoading && (
        <div className="flex flex-col gap-2 mt-4">
          {data?.map((article) => (
            <div className="py-2" key={article.id}>
              <Link href={`/articles/${article.id}`}>
                <h4 className="text-lg font-medium hover:underline">
                  {article.title}
                </h4>
              </Link>
              <div className="flex flex-wrap gap-2 mt-2">
                {" "}
                {article.categories
                  ?.map((category) => getCategoryFor(category.name))
                  .map((category: Category, index: number) => (
                    <Chip
                      Icon={categoriesToIconsMap[category]}
                      key={index}
                      label={categoriesToDisplayName[category]}
                      size="sm"
                      variant="primary"
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopArticleList;
