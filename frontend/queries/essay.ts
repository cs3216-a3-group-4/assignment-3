import { queryOptions } from "@tanstack/react-query";
import { QueryKeys } from "@/queries/utils/query-keys";
import { getEssayEssaysIdGet } from "@/client";

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
