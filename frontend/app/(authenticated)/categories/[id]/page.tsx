"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { CategoryDTO, MiniEventDTO } from "@/client";
import Pagination from "@/components/navigation/pagination";
import ScrollToTopButton from "@/components/navigation/scroll-to-top-button";
import ArticleLoading from "@/components/news/article-loading";
import NewsArticle from "@/components/news/news-article";
import usePagination from "@/hooks/use-pagination";
import { getCategories } from "@/queries/category";
import { getEventsForCategory } from "@/queries/event";

const Page = ({ params }: { params: { id: string } }) => {
  const categoryId = parseInt(params.id);
  const [categoryName, setCategoryName] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);

  const { page, pageCount, getPageUrl } = usePagination({ totalCount });
  const { data: events, isSuccess: isEventsLoaded } = useQuery(
    getEventsForCategory(categoryId, page),
  );
  const { data: categories, isSuccess: isCategoriesLoaded } =
    useQuery(getCategories());

  useEffect(() => {
    setTotalCount(events?.total_count);
  }, [events?.total_count]);

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

  return (
    <div className="relative w-full h-full">
      <div
        className="flex bg-muted w-full h-full max-h-full py-8 overflow-y-auto"
        id="home-page"
      >
        <div className="flex flex-col py-6 lg:py-12 w-full h-fit mx-4 md:mx-8 xl:mx-24 bg-background rounded-lg border border-border px-8">
          {/* TODO: x-padding here is tied to the news article */}
          <div
            className="flex flex-col mb-4 gap-y-2 px-4 md:px-8 xl:px-12"
            id="homePage"
          >
            <div className="flex">
              <span className="text-4xl 2xl:text-4xl font-bold text-primary-800">
                Top events from {categoryName}
              </span>
            </div>
          </div>

          <div className="flex flex-col w-full">
            {!isEventsLoaded ? (
              <div className="flex flex-col w-full">
                <ArticleLoading />
                <ArticleLoading />
                <ArticleLoading />
              </div>
            ) : (
              events?.data.map((newsEvent: MiniEventDTO, index: number) => (
                <NewsArticle key={index} newsEvent={newsEvent} />
              ))
            )}
          </div>
          {isEventsLoaded && (
            <Pagination
              getPageUrl={getPageUrl}
              page={page}
              pageCount={pageCount}
            />
          )}
        </div>
      </div>

      <ScrollToTopButton
        className="absolute right-4 bottom-4"
        minHeight={200}
        scrollElementId="home-page"
      />
    </div>
  );
};

export default Page;
