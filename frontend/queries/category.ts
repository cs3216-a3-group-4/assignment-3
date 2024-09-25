import { queryOptions } from "@tanstack/react-query";
import { QueryKeys } from "@/queries/utils/query-keys";
import { getCategoriesCategoriesGet } from "@/client";

export const getCategories = () =>
  queryOptions({
    queryKey: [QueryKeys.Categories],
    queryFn: () =>
      getCategoriesCategoriesGet().then((response) => response.data),
  });
