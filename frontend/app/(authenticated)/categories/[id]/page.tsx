"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { CategoryDTO, MiniArticleDTO } from "@/client";
import Pagination from "@/components/navigation/pagination";
import ScrollToTopButton from "@/components/navigation/scroll-to-top-button";
import ArticleLoading from "@/components/news/article-loading";
import NewsArticle from "@/components/news/news-article";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import usePagination from "@/hooks/use-pagination";
import { getArticlesForCategory } from "@/queries/article";
import { getCategories } from "@/queries/category";
import { useUserStore } from "@/store/user/user-store-provider";

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchBar = useRef<HTMLInputElement>(null);

  const categoryId = parseInt(params.id);
  const [categoryName, setCategoryName] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const initialSingaporeOnly = searchParams.get("singaporeOnly") === "true";
  const [singaporeOnly, setSingaporeOnly] =
    useState<boolean>(initialSingaporeOnly);

  const user = useUserStore((state) => state.user);
  const { page, pageCount, getPageUrl } = usePagination({ totalCount });
  const {
    data: articles,
    isSuccess: isArticlesLoaded,
    refetch: refetchPage,
  } = useQuery(
    getArticlesForCategory(
      categoryId,
      page,
      singaporeOnly,
      searchQuery ?? undefined,
    ),
  );
  const { data: categories, isSuccess: isCategoriesLoaded } =
    useQuery(getCategories());

  useEffect(() => {
    setTotalCount(articles?.total_count);
  }, [articles?.total_count]);

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

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("singaporeOnly", singaporeOnly.toString());
    router.push(`?${params.toString()}`);
  });

  return (
    <div className="relative w-full h-full">
      <div
        className="flex bg-muted w-full h-full max-h-full py-8 overflow-y-auto"
        id="home-page"
      >
        <div className="flex flex-col py-6 lg:py-12 w-full h-fit md:mx-8 xl:mx-24 bg-background rounded-lg border border-border px-8">
          {/* TODO: x-padding here is tied to the news article */}
          <div
            className="flex flex-col mb-4 gap-y-2 sm:px-4 md:px-8 xl:px-12"
            id="homePage"
          >
            <div className="flex">
              <span className="text-2xl md:text-4xl 2xl:text-4xl font-bold text-primary-800">
                Top articles from {categoryName}
              </span>
            </div>
          </div>
          <div className="flex items-center w-full sm:px-1 md:px-5 xl:px-9 justify-between">
            <div className="flex items-center">
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
                    <SelectLabel className="text-base">
                      Event filter
                    </SelectLabel>
                    <SelectItem className="text-base" value="global">
                      Global
                    </SelectItem>
                    <SelectItem className="text-base" value="singapore-only">
                      Singapore
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                defaultValue={categoryId.toString()}
                onValueChange={(catId) => {
                  if (catId !== categoryId.toString()) {
                    router.push(
                      catId === "my" ? "/articles" : `/categories/${catId}`,
                    );
                  }
                  return catId;
                }}
              >
                <SelectTrigger
                  className={
                    "border-none focus:ring-0 focus:ring-offset-0 font-medium hover:bg-gray-200/40 rounded-2xl text-primary-900 text-base"
                  }
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="min-w-[16rem]">
                  <SelectGroup>
                    <SelectLabel className="text-sm">
                      Category filter
                    </SelectLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SelectItem className="mb-3" value="my">
                            My GP categories ({user?.categories.length})
                          </SelectItem>
                        </TooltipTrigger>
                        <TooltipContent
                          className="flex max-w-[14rem]"
                          side="bottom"
                        >
                          <div className="flex text-wrap">
                            {user?.categories
                              .map((category) => category.name)
                              .join(", ")}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-sm">
                      Individual categories
                    </SelectLabel>
                    {categories?.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {!isSearching && (
              <div onClick={() => setIsSearching(true)}>
                <Button size="icon" variant="ghost">
                  <Search size={24} />
                </Button>
              </div>
            )}
          </div>

          {isSearching && (
            <div className="flex items-center w-full px-4 md:px-8 xl:px-12 gap-x-2 mt-2 flex-col sm:flex-row">
              <Input
                className="mr-2"
                placeholder="Search for article titles..."
                ref={searchBar}
              />
              <div className="flex items-center gap-x-2 mt-2 sm:mt-0 w-full sm:w-fit sm:inline-flex">
                <Button
                  className="w-full sm:w-fit"
                  onClick={() => {
                    setSearchQuery(searchBar.current?.value ?? null);
                    refetchPage();
                  }}
                  size="sm"
                >
                  Search
                </Button>
                <Button
                  className="w-full sm:w-fit"
                  onClick={() => {
                    setIsSearching(false);
                    setSearchQuery(null);
                    refetchPage();
                  }}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-col w-full">
            {!isArticlesLoaded ? (
              <div className="flex flex-col w-full">
                <ArticleLoading />
                <ArticleLoading />
                <ArticleLoading />
              </div>
            ) : (
              articles?.data.map(
                (newsArticle: MiniArticleDTO, index: number) => (
                  <NewsArticle key={index} newsArticle={newsArticle} />
                ),
              )
            )}
          </div>
          {isArticlesLoaded && (
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
