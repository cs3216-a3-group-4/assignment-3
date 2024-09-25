import { queryOptions } from "@tanstack/react-query";

import {
  getEventEventsIdGet,
  getEventsEventsGet,
} from "@/client/services.gen";

import { QueryKeys } from "./utils/query-keys";

export const getEvent = (id: number) =>
  queryOptions({
    queryKey: [QueryKeys.Events, id],
    queryFn: () =>
      getEventEventsIdGet({
        withCredentials: true,
        query: { id },
      }).then((data) => data.data),
  });

export const getEventsForCategory = (categoryId: number) =>
  queryOptions({
    queryKey: [QueryKeys.Categories, categoryId],
    queryFn: () =>
      getEventsEventsGet({
        withCredentials: true,
        query: {
          category_ids: [ categoryId ],
        },
      }).then((data) => data.data),
  });
  