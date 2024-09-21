import { queryOptions } from "@tanstack/react-query";

import { getUserAuthSessionGet } from "@/client/services.gen";

import { QueryKeys } from "./utils/query-keys";

export const getUserProfile = () =>
  queryOptions({
    queryKey: [QueryKeys.UserProfile],
    queryFn: () =>
      getUserAuthSessionGet({ withCredentials: true }).then(
        (data) => data.data,
      ),
  });
