import { useMutation, useQueryClient } from "@tanstack/react-query";

import { LikeType, upsertLikeLikesPost } from "@/client";

import { QueryKeys } from "./utils/query-keys";

export const useLikeArticle = (article_id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      concept_id,
      type,
    }: {
      concept_id: number;
      type: LikeType;
    }) => {
      return upsertLikeLikesPost({
        body: {
          concept_id,
          article_id,
          type,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Articles, article_id],
      });
    },
  });
};

// TODO: deprecate
export const useLikeEvent = (event_id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      analysis_id,
      type,
    }: {
      analysis_id: number;
      type: LikeType;
    }) => {
      return upsertLikeLikesPost({
        body: {
          analysis_id,
          type,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Events, event_id] });
    },
  });
};

export const useLikePoint = (answer_id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ point_id, type }: { point_id: number; type: LikeType }) => {
      return upsertLikeLikesPost({
        body: {
          point_id,
          type,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Answers, answer_id],
      });
    },
  });
};
