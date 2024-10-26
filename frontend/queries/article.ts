import { queryOptions } from "@tanstack/react-query";

import { getArticlesArticlesGet, getTopArticlesArticlesTopGet } from "@/client";

import { QueryKeys } from "./utils/query-keys";
import { NUM_EVENTS_PER_PAGE } from "./event";

export const getTopArticles = (isSingapore: boolean) =>
  queryOptions({
    queryKey: [QueryKeys.Articles, { top: true }, isSingapore],
    queryFn: () =>
      getTopArticlesArticlesTopGet({
        query: { singapore_only: isSingapore },
      }).then((data) => data.data),
  });

export const getArticlesPage = (
  startDate: string,
  page: number,
  isSingapore: boolean,
  categoryIds?: number[],
) =>
  queryOptions({
    queryKey: [QueryKeys.Articles, startDate, isSingapore, page, categoryIds],
    queryFn: () =>
      getArticlesArticlesGet({
        query: {
          start_date: startDate,
          category_ids: categoryIds,
          limit: NUM_EVENTS_PER_PAGE,
          offset: (page - 1) * NUM_EVENTS_PER_PAGE,
          singapore_only: isSingapore,
        },
      }).then((data) => data.data),
  });

export const getArticles = (
  startDate: string,
  limit: number,
  isSingapore: boolean,
  categoryIds?: number[],
) =>
  queryOptions({
    queryKey: [QueryKeys.Articles, isSingapore, { limit }, categoryIds],
    queryFn: () =>
      getArticlesArticlesGet({
        query: {
          start_date: startDate,
          category_ids: categoryIds,
          limit,
          singapore_only: isSingapore,
        },
      }).then((data) => data.data),
  });

export const getBookmarkedArticles = (page: number) =>
  queryOptions({
    queryKey: [QueryKeys.Events, QueryKeys.Bookmarks],
    queryFn: () =>
      getArticlesArticlesGet({
        withCredentials: true,
        query: {
          limit: NUM_EVENTS_PER_PAGE,
          offset: (page - 1) * NUM_EVENTS_PER_PAGE,
          bookmarks: true,
        },
      }).then((data) => data.data),
  });

export const getArticlesForCategory = (
  categoryId: number,
  page: number,
  singaporeOnly: boolean,
) =>
  queryOptions({
    queryKey: [QueryKeys.Categories, categoryId, singaporeOnly, page],
    queryFn: () =>
      getArticlesArticlesGet({
        withCredentials: true,
        query: {
          singapore_only: singaporeOnly,
          category_ids: [categoryId],
          limit: NUM_EVENTS_PER_PAGE,
          offset: (page - 1) * NUM_EVENTS_PER_PAGE,
        },
      }).then((data) => data.data),
  });
