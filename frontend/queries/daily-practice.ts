import { queryOptions, useMutation } from "@tanstack/react-query";

import { getTodaysPracticeDailyPracticesTodayGet } from "@/client";
import { QueryKeys } from "@/queries/utils/query-keys";

import { parseDate } from "@/utils/date";

export const getTodaysDailyPractice = () =>
  queryOptions({
    queryKey: [QueryKeys.DailyPractice, parseDate(Date.now())],
    queryFn: () =>
      getTodaysPracticeDailyPracticesTodayGet().then((data) => data.data),
  });
