import { queryOptions } from "@tanstack/react-query";

import {
  getUserQuestionsUserQuestionsGet,
  getUserQuestionUserQuestionsIdGet,
} from "@/client";

import { QueryKeys } from "./utils/query-keys";

export const getAnswer = (id: number) =>
  queryOptions({
    queryKey: [QueryKeys.Answers, id],
    queryFn: () =>
      getUserQuestionUserQuestionsIdGet({
        path: {
          id: id,
        },
      }).then((response) => response.data),
  });

export const getAnswers = () =>
  queryOptions({
    queryKey: [QueryKeys.Answers],
    queryFn: () =>
      getUserQuestionsUserQuestionsGet().then((response) => response.data),
  });
