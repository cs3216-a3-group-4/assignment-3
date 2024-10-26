import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createNoteNotesPost,
  deleteNoteNotesIdDelete,
  getAllNotesNotesGet,
  updateNoteNotesIdPut,
} from "@/client";

import { QueryKeys } from "./utils/query-keys";

export const useAddArticleNote = (article_id: number) => {
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
          parent_id: article_id,
          parent_type: "article",
          category_id,
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

export const useAddConceptNote = (article_id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      content,
      concept_id,
      start_index,
      end_index,
      category_id,
    }: {
      content: string;
      concept_id: number;
      start_index: number;
      end_index: number;
      category_id?: number;
    }) => {
      return createNoteNotesPost({
        body: {
          content,
          parent_id: concept_id,
          parent_type: "concept",
          start_index,
          end_index,
          category_id,
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
          category_id,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Events, event_id] });
    },
  });
};

export const useEditArticleNote = (article_id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      content,
      category_id,
    }: {
      id: number;
      content: string;
      category_id?: number;
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
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Articles, article_id],
      });
    },
  });
};

// TODO: depcreate
export const useEditEventNote = (event_id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      content,
      category_id,
    }: {
      id: number;
      content: string;
      category_id?: number;
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

export const getAllNotes = (categoryId?: number) =>
  queryOptions({
    queryKey: [QueryKeys.Notes, { categoryId }],
    queryFn: () =>
      getAllNotesNotesGet({
        query: {
          category_id: categoryId,
        },
      }).then((response) => response.data),
  });
