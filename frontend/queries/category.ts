import { queryOptions } from "@tanstack/react-query";

import { getCategoriesCategoriesGet } from "@/client";
import { QueryKeys } from "@/queries/utils/query-keys";

export const getCategories = () =>
  queryOptions({
    queryKey: [QueryKeys.Categories],
    queryFn: () =>
      getCategoriesCategoriesGet().then((response) => response.data),
    staleTime: Infinity,
  });
