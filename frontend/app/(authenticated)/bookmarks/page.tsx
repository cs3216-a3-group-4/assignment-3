"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";

import { CategoryDTO, MiniEventDTO } from "@/client";
import ScrollToTopButton from "@/components/navigation/scroll-to-top-button";
import ArticleLoading from "@/components/news/article-loading";
import NewsArticle from "@/components/news/news-article";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getCategories } from "@/queries/category";
import { getBookmarkedEvents } from "@/queries/event";

function isNumeric(value: string | null) {
  return value !== null && /^-?\d+$/.test(value);
}

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryId = parseInt(params.id);

  const pageStr = searchParams.get("page");

  const page = isNumeric(pageStr) ? parseInt(pageStr!) : 1;

  const [categoryName, setCategoryName] = useState<string>(""); // eslint-disable-line

  const { data: events, isSuccess: isEventsLoaded } = useQuery(
    getBookmarkedEvents(page),
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

  const getPageUrl = (page: number) => {
    // now you got a read/write object
    const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form

    // update as necessary
    current.set("page", page.toString());

    // cast to string
    const search = current.toString();
    // or const query = `${'?'.repeat(search.length && 1)}${search}`;
    const query = search ? `?${search}` : "";

    return `${pathname}${query}`;
  };

  const changePage = (page: number) => {
    router.push(getPageUrl(page));
  };

  if (!pageStr) {
    changePage(1);
    return;
  }

  const items = events?.total_count;
  const pageCount = items !== undefined && Math.ceil(items / 10);
  if (pageCount !== false) {
    if (page <= 0) {
      changePage(1);
    }
    if (page > pageCount) {
      changePage(pageCount);
    }
  }

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
            <div className="flex items-baseline gap-4">
              <Bookmark className="w-7 h-7" />
              <span className="text-4xl 2xl:text-4xl font-bold text-primary-800">
                Bookmarked events
              </span>
            </div>
          </div>

          <div className="flex flex-col w-full">
            {!isEventsLoaded && (
              <div className="flex flex-col w-full">
                <ArticleLoading />
                <ArticleLoading />
                <ArticleLoading />
              </div>
            )}
            {isEventsLoaded &&
              events!.data &&
              events!.data.map((newsEvent: MiniEventDTO, index: number) => (
                <NewsArticle key={index} newsEvent={newsEvent} />
              ))}
          </div>
          {isEventsLoaded && events!.data.length !== 0 && (
            <Pagination className="py-8">
              <PaginationContent>
                {page !== 1 && (
                  <PaginationItem>
                    <PaginationPrevious href={getPageUrl(page - 1)} />
                  </PaginationItem>
                )}
                {/* Only for last page */}
                {page == pageCount && page - 2 >= 1 && (
                  <PaginationItem>
                    <PaginationLink href={getPageUrl(page - 2)}>
                      {page - 2}
                    </PaginationLink>
                  </PaginationItem>
                )}
                {page - 1 >= 1 && (
                  <PaginationItem>
                    <PaginationLink href={getPageUrl(page - 1)}>
                      {page - 1}
                    </PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    {page}
                  </PaginationLink>
                </PaginationItem>
                {page !== pageCount && (
                  <PaginationItem>
                    <PaginationLink href={getPageUrl(page + 1)}>
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}
                {/* Only for first page */}
                {page === 1 && (pageCount as number) >= 3 && (
                  <PaginationItem>
                    <PaginationLink href={getPageUrl(page + 2)}>
                      {page + 2}
                    </PaginationLink>
                  </PaginationItem>
                )}
                {page !== pageCount && (
                  <PaginationItem>
                    <PaginationNext href={getPageUrl(page + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
          {isEventsLoaded && events!.data.length === 0 && (
            <Card className="mx-auto my-8 p-8 flex flex-col gap-8 max-w-lg">
              <h2 className="text-xl">
                You do not have any bookmarks. Return after you bookmark some
                events!
              </h2>
              <Link href="/">
                <Button>Go to home</Button>
              </Link>
            </Card>
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
