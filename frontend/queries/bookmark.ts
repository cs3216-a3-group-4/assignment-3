import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addBookmarkEventsIdBookmarksPost,
  deleteBookmarkEventsIdBookmarksDelete,
  LikeType,
  upsertLikeLikesPost,
} from "@/client";

import { QueryKeys } from "./utils/query-keys";

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

export const useAddBookmark = (event_id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return addBookmarkEventsIdBookmarksPost({
        path: { id: event_id },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Events, event_id] });
    },
  });
};

export const useRemoveBookmark = (event_id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return deleteBookmarkEventsIdBookmarksDelete({
        path: { id: event_id },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Events, event_id] });
    },
  });
};
