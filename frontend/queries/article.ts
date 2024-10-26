import { queryOptions } from "@tanstack/react-query";

import { getArticleArticlesIdGet } from "@/client";
import { QueryKeys } from "@/queries/utils/query-keys";

export const getArticle = (id: number) =>
  queryOptions({
    queryKey: [QueryKeys.Events, id],
    queryFn: () =>
      getArticleArticlesIdGet({
        withCredentials: true,
        path: {
          id,
        },
      }).then((data) => data.data),
  });
