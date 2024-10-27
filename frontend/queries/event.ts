import { queryOptions } from "@tanstack/react-query";

import { getEventEventsIdGet, getEventsEventsGet } from "@/client/services.gen";

import { QueryKeys } from "./utils/query-keys";

export const NUM_EVENTS_PER_PAGE = 10;

export const getEvent = (id: number) =>
  queryOptions({
    queryKey: [QueryKeys.Events, id],
    queryFn: () =>
      getEventEventsIdGet({
        withCredentials: true,
        path: {
          id,
        },
      }).then((data) => data.data),
  });

export const getHomeEvents = (
  startDate: string,
  page: number,
  isSingapore: boolean,
  categoryIds?: number[],
) =>
  queryOptions({
    queryKey: [QueryKeys.Categories, categoryIds, page, isSingapore, startDate],
    queryFn: () =>
      getEventsEventsGet({
        withCredentials: true,
        query: {
          start_date: startDate,
          category_ids: categoryIds,
          limit: NUM_EVENTS_PER_PAGE,
          offset: (page - 1) * NUM_EVENTS_PER_PAGE,
          singapore_only: isSingapore,
        },
      }).then((data) => data.data),
  });

export const getEventsForCategory = (
  categoryId: number,
  page: number,
  singaporeOnly: boolean,
) =>
  queryOptions({
    queryKey: [QueryKeys.Categories, categoryId, singaporeOnly, page],
    queryFn: () =>
      getEventsEventsGet({
        withCredentials: true,
        query: {
          singapore_only: singaporeOnly,
          category_ids: [categoryId],
          limit: NUM_EVENTS_PER_PAGE,
          offset: (page - 1) * NUM_EVENTS_PER_PAGE,
        },
      }).then((data) => data.data),
  });

export const getBookmarkedEvents = (page: number) =>
  queryOptions({
    queryKey: [QueryKeys.Events, QueryKeys.Bookmarks],
    queryFn: () =>
      getEventsEventsGet({
        withCredentials: true,
        query: {
          limit: NUM_EVENTS_PER_PAGE,
          offset: (page - 1) * NUM_EVENTS_PER_PAGE,
          bookmarks: true,
        },
      }).then((data) => data.data),
  });
