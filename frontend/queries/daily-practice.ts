import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createDailyPracticeAttemptDailyPracticesIdAttemptsPost,
  getDayPracticeDailyPracticesIdGet,
  getTodaysPracticeDailyPracticesTodayGet,
} from "@/client";
import { QueryKeys } from "@/queries/utils/query-keys";

import { parseDate } from "@/utils/date";

export const getTodaysDailyPractice = () =>
  queryOptions({
    queryKey: [QueryKeys.DailyPractice, "date", parseDate(Date.now())],
    queryFn: () =>
      getTodaysPracticeDailyPracticesTodayGet().then((data) => data.data),
  });

export const getDailyPractice = (id: number) =>
  queryOptions({
    queryKey: [QueryKeys.DailyPractice, id],
    queryFn: () =>
      getDayPracticeDailyPracticesIdGet({ path: { id } }).then(
        (data) => data.data,
      ),
  });

export const useCreateDailyPracticeAttempt = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ points }: { points: string[] }) => {
      return createDailyPracticeAttemptDailyPracticesIdAttemptsPost({
        path: {
          id,
        },
        body: {
          points,
        },
      });
    },
  });
};
