"use client";

import Image from "next/image";
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
import { toQueryDate } from "@/utils/date";

const ArticleFeed = () => {
  const user = useUserStore((state) => state.user);

  const eventStartDate = new Date();

  eventStartDate.setDate(eventStartDate.getDate() - 1);

  const { data: articles, isLoading } = useQuery(
    getArticles(
      toQueryDate(eventStartDate),
      15,
      false,
      user?.categories.map((category) => category.id),
    ),
  );

  return (
    <div className="border-l-2 border-r-2 px-4">
      <h2 className="flex text-3xl font-semibold justify-between align-center">
        Today&apos;s top events for you
        <Button variant={"outline"}>
          Read more
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </h2>
      {!isLoading && articles?.data && (
        <div className="flex flex-col gap-2 mt-4">
          {articles.data.map((article) => (
            <div className="py-2 flex gap-2 justify-between" key={article.id}>
              <div>
                <h4 className="text-xl font-medium hover:underline">
                  {article.title}
                </h4>
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
      )}
    </div>
  );
};

export default ArticleFeed;
