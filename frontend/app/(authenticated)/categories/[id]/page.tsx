"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { CategoryDTO, MiniEventDTO } from "@/client";
import ArticleLoading from "@/components/news/article-loading";
import NewsArticle from "@/components/news/news-article";
import { getCategories } from "@/queries/category";
import { getEventsForCategory } from "@/queries/event";

const Page = ({ params }: { params: { id: string } }) => {
  const categoryId = parseInt(params.id);
  const [categoryName, setCategoryName] = useState<string>("");
  const { data: events, isSuccess: isEventsLoaded } = useQuery(
    getEventsForCategory(categoryId),
  );
  const { data: categories, isSuccess: isCategoriesLoaded } =
    useQuery(getCategories());

  // Very inefficient, but is there a better way to do this? New StoreProvider for CategoryDTO[]?
  useEffect(() => {
    if (isCategoriesLoaded && categories!.length > 0) {
      categories!.forEach((category: CategoryDTO) => {
        if (category.id == categoryId) {
          setCategoryName(category.name);
        }
      });
    }
  }, [categories, isCategoriesLoaded, categoryId]);

  const Articles = () => {
    if (!isEventsLoaded) {
      return (
        <>
          <ArticleLoading />
          <ArticleLoading />
          <ArticleLoading />
        </>
      );
    }

    const eventData = events!.data;
    if (eventData.length == 0) {
      return (
        <div className="flex w-full justify-center">
          <p className="text-sm text-offblack">
            No recent events. Try refreshing the page.
          </p>
        </div>
      );
    }

    return eventData.map((newsEvent: MiniEventDTO, index: number) => (
      <NewsArticle key={index} newsEvent={newsEvent} />
    ));
  };

  return (
    <div className="flex flex-col w-full py-8">
      <div className="flex flex-col mb-8 gap-y-2 mx-8 md:mx-16 xl:mx-32">
        <span className="text-sm text-muted-foreground">
          {new Date().toDateString()}
        </span>
        <h1 className="text-3xl 2xl:text-4xl font-bold">
          Top events from {categoryName}
        </h1>
      </div>

      <div className="flex flex-col w-auto mx-4 md:mx-8 xl:mx-24">
        <Articles />
      </div>
    </div>
  );
};

export default Page;
