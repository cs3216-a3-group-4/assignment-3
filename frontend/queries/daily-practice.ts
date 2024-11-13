import { queryOptions, useMutation } from "@tanstack/react-query";

import {
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
