import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createNoteNotesPost,
  deleteNoteNotesIdDelete,
  updateNoteNotesIdPut,
} from "@/client";

import { QueryKeys } from "./utils/query-keys";

export const useAddEventNote = (event_id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      category_id,
      content,
    }: {
      category_id: number;
      content: string;
    }) => {
      return createNoteNotesPost({
        body: {
          content,
          parent_id: event_id,
          parent_type: "event",
          category_id,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Events, event_id] });
    },
  });
};

export const useAddAnalysisNote = (event_id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      content,
      analysis_id,
      start_index,
      end_index,
      category_id,
    }: {
      content: string;
      analysis_id: number;
      start_index: number;
      end_index: number;
      category_id?: number;
    }) => {
      return createNoteNotesPost({
        body: {
          content,
          parent_id: analysis_id,
          parent_type: "analysis",
          start_index,
          end_index,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Events, event_id] });
    },
  });
};

export const useEditEventNote = (event_id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      category_id,
      content,
    }: {
      id: number;
      category_id: number;
      content: string;
    }) => {
      return updateNoteNotesIdPut({
        body: {
          content,
          category_id,
        },
        path: {
          id,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Events, event_id] });
    },
  });
};

export const useDeleteNote = (event_id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => {
      return deleteNoteNotesIdDelete({
        path: { id },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Events, event_id] });
    },
  });
};
