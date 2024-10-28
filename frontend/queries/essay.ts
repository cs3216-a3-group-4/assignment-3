import { queryOptions } from "@tanstack/react-query";

import { getEssayEssaysIdGet, getEssaysEssaysGet } from "@/client";
import { QueryKeys } from "@/queries/utils/query-keys";

export const getEssays = () =>
  queryOptions({
    queryKey: [QueryKeys.Essays],
    queryFn: () =>
      getEssaysEssaysGet({
        withCredentials: true,
      }).then((data) => data.data),
  });

export const getEssay = (id: number) =>
  queryOptions({
    queryKey: [QueryKeys.Essays, id],
    queryFn: () =>
      getEssayEssaysIdGet({
        withCredentials: true,
        path: {
          id,
        },
      }).then((data) => data.data),
  });
