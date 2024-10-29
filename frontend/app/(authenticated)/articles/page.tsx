"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import DateRangeSelector, { Period } from "@/app/_home/date-range-selector";
import Pagination from "@/components/navigation/pagination";
import ScrollToTopButton from "@/components/navigation/scroll-to-top-button";
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
import { getArticlesPage } from "@/queries/article";
import { getCategories } from "@/queries/category";
import { useUserStore } from "@/store/user/user-store-provider";
import { parseDate, toQueryDate } from "@/utils/date";

import ArticlesList from "./articles-list";

const DEFAULT_EVENT_PERIOD = Period.Week;

/* This component should only be rendered to authenticated users */
const Articles = () => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const searchParams = useSearchParams();

  const eventPeriod = user?.top_events_period
    ? user.top_events_period
    : DEFAULT_EVENT_PERIOD;

  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);

  const { page, pageCount, getPageUrl } = usePagination({
    totalCount,
  });

  const eventStartDate = useMemo(() => {
    const eventStartDate = new Date();
    eventStartDate.setDate(eventStartDate.getDate() - eventPeriod);
    return eventStartDate;
  }, [eventPeriod]);

  const initialSingaporeOnly = searchParams.get("singaporeOnly") === "true";

  const [singaporeOnly, setSingaporeOnly] =
    useState<boolean>(initialSingaporeOnly);

  const { data: categories } = useQuery(getCategories());
  const { data: articles, isSuccess: isArticlesLoaded } = useQuery(
    getArticlesPage(
      toQueryDate(eventStartDate),
      page,
      singaporeOnly,
      user?.categories.map((category) => category.id),
    ),
  );

  useEffect(() => {
    setTotalCount(articles?.total_count);
  }, [articles?.total_count]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("singaporeOnly", singaporeOnly.toString());

    router.push(`?${params.toString()}`);
  }, [singaporeOnly, router, searchParams]);

  if (!user) {
    return;
  }

  if (!user!.categories.length) {
    router.push("/onboarding");
  }

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
            <div>
              <span className="text-2xl md:text-4xl 2xl:text-4xl font-bold text-primary-800">
                What happened this&nbsp;
              </span>
              <DateRangeSelector selectedPeriod={eventPeriod} />
            </div>
            <span className="text-primary text-lg">
              {parseDate(eventStartDate)} - {parseDate(new Date())}
            </span>
          </div>
          <div className="flex items-center w-fit sm:px-1 md:px-5 xl:px-9">
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
                  <SelectLabel className="text-base">Event filter</SelectLabel>
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
              defaultValue="my"
              onValueChange={(categoryId) => {
                if (categoryId !== "my") {
                  router.push(`/categories/${categoryId}`);
                }
                return categoryId;
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
                  <SelectLabel className="text-sm">Category filter</SelectLabel>
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
                          {user.categories
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

          <ArticlesList
            articles={articles}
            isArticlesLoaded={isArticlesLoaded}
          />

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

export default Articles;
