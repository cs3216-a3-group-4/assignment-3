import { queryOptions } from "@tanstack/react-query";

import {
  getEventEventsIdGet,
  getUserAuthSessionGet,
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
