import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getUserAuthSessionGet,
  updateProfileProfilePut,
} from "@/client/services.gen";

import { QueryKeys } from "./utils/query-keys";

export const getUserProfile = () =>
  queryOptions({
    queryKey: [QueryKeys.UserProfile],
    queryFn: () =>
      getUserAuthSessionGet({ withCredentials: true }).then(
        (data) => data.data,
      ),
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryIds }: { categoryIds: number[] }) => {
      return updateProfileProfilePut({
        body: {
          category_ids: categoryIds,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.UserProfile] });
    },
  });
};
