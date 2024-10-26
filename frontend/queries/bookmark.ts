import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addBookmarkArticlesIdBookmarksPost,
  addBookmarkEventsIdBookmarksPost,
  deleteBookmarkArticlesIdBookmarksDelete,
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

export const useAddBookmarkArticle = (article_id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return addBookmarkArticlesIdBookmarksPost({
        path: { id: article_id },
      });
    },
    onSuccess: () => {
      // TODO: maybe don't refetch EVERY article to update one bookmark?
      // don't have enough sanity to fix it properly atm
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Articles],
      });
    },
  });
};

export const useRemoveBookmarkArticle = (article_id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return deleteBookmarkArticlesIdBookmarksDelete({
        path: { id: article_id },
      });
    },
    onSuccess: () => {
      // TODO: maybe don't refetch EVERY article to update one bookmark?
      // don't have enough sanity to fix it properly atm
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Articles],
      });
    },
  });
};
