import { queryOptions, useMutation } from "@tanstack/react-query";

import {
  getArticleArticlesIdGet,
  getArticlesArticlesGet,
  getTopArticlesArticlesTopGet,
  readArticleArticlesIdReadPost,
} from "@/client";
import { QueryKeys } from "@/queries/utils/query-keys";

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
  page: number,
  isSingapore: boolean,
  categoryIds?: number[],
  searchQuery?: string,
  startDate?: string,
) =>
  queryOptions({
    queryKey: [
      QueryKeys.Articles,
      startDate,
      isSingapore,
      page,
      categoryIds,
      searchQuery,
    ],
    queryFn: () =>
      getArticlesArticlesGet({
        query: {
          start_date: startDate,
          category_ids: categoryIds,
          limit: NUM_EVENTS_PER_PAGE,
          offset: (page - 1) * NUM_EVENTS_PER_PAGE,
          singapore_only: isSingapore,
          search: searchQuery,
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
    queryKey: [QueryKeys.Articles, QueryKeys.Bookmarks],
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
  searchQuery?: string,
) =>
  queryOptions({
    queryKey: [
      QueryKeys.Categories,
      categoryId,
      singaporeOnly,
      page,
      searchQuery,
    ],
    queryFn: () =>
      getArticlesArticlesGet({
        withCredentials: true,
        query: {
          singapore_only: singaporeOnly,
          category_ids: [categoryId],
          limit: NUM_EVENTS_PER_PAGE,
          offset: (page - 1) * NUM_EVENTS_PER_PAGE,
          search: searchQuery,
        },
      }).then((data) => data.data),
  });

export const getArticle = (id: number) =>
  queryOptions({
    queryKey: [QueryKeys.Articles, id],
    queryFn: () =>
      getArticleArticlesIdGet({
        withCredentials: true,
        path: {
          id,
        },
      }).then((data) => data.data),
  });

export const useReadArticle = (id: number) => {
  return useMutation({
    mutationFn: () => {
      return readArticleArticlesIdReadPost({ path: { id } });
    },
  });
};
