import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  changePasswordAuthChangePasswordPut,
  getUserAuthSessionGet,
  updateProfileProfilePut,
} from "@/client/services.gen";

import { QueryKeys } from "./utils/query-keys";

export const getUserProfile = () => {
  return queryOptions({
    queryKey: [QueryKeys.UserProfile],
    queryFn: () =>
      getUserAuthSessionGet({ withCredentials: true }).then(
        (data) => data.data,
      ),
  });
};

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

export const useUpdateTopEventsPeriod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ timePeriod }: { timePeriod: number }) => {
      return updateProfileProfilePut({
        body: {
          top_events_period: timePeriod,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.UserProfile] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({
      password,
      confirmPassword,
      oldPassword,
    }: {
      password: string;
      confirmPassword: string;
      oldPassword: string;
    }) => {
      return changePasswordAuthChangePasswordPut({
        body: {
          password,
          confirm_password: confirmPassword,
          old_password: oldPassword,
        },
      });
    },
  });
};
