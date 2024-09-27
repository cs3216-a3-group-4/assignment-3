import { queryOptions } from "@tanstack/react-query";
import { QueryKeys } from "./utils/query-keys";
import {
  getUserQuestionsUserQuestionsGet,
  getUserQuestionUserQuestionsIdGet,
} from "@/client";

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
