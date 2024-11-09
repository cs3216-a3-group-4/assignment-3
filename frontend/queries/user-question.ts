import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPointUserQuestionsIdPointsPost,
  getUserQuestionsUserQuestionsGet,
  getUserQuestionUserQuestionsIdGet,
  regenerateExamplesUserQuestionsPointIdExamplesPut,
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

export const useCreatePoint = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ title, positive }: { title: string; positive: boolean }) =>
      createPointUserQuestionsIdPointsPost({
        path: { id },
        body: {
          title,
          positive,
        },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Answers, id],
      }),
  });
};

export const useRegenerateExamples = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ point_id }: { point_id: number }) =>
      regenerateExamplesUserQuestionsPointIdExamplesPut({
        path: { point_id },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Answers, id],
      }),
  });
};
