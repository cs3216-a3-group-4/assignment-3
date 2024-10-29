import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { EditIcon, TrashIcon } from "lucide-react";

import { ArticleConceptDTO, NoteDTO } from "@/client";
import Dialog from "@/components/dialog/Dialog";
import CategoryChip from "@/components/display/category-chip";
import { Button } from "@/components/ui/button";
import { useDeleteNote, useEditArticleNote } from "@/queries/note";
import { Category } from "@/types/categories";

import NoteForm, { NoteFormType } from "./note-form";

interface MiniGenericConceptNoteProps {
  note: NoteDTO;
  articleConcepts: ArticleConceptDTO[];
  articleId: number;
}

const MiniGenericConceptNote = ({
  note,
  articleConcepts,
  articleId,
}: MiniGenericConceptNoteProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const editNoteMutation = useEditArticleNote(articleId);
  const deleteNoteMutation = useDeleteNote(articleId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const articleConcept =
    note.parent_type === "article_concept" &&
    articleConcepts.find(
      (articleConcept) => articleConcept.concept.id === note.parent_id,
    );

  const quote =
    articleConcept &&
    note.start_index !== null &&
    note.end_index !== undefined &&
    note.end_index !== null &&
    articleConcept.explanation.slice(note.start_index, note.end_index + 1);

  const onClick = () => {
    if (articleConcept) {
      document
        .getElementById("concept-" + articleConcept.concept.id)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
    } else if (note.parent_type === "article") {
      document.getElementById(`article-note-${note.id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  };

  const handleEditNote: SubmitHandler<NoteFormType> = ({
    content,
    category_id,
  }) => {
    editNoteMutation.mutate({
      id: note.id,
      content,
      category_id: category_id ? parseInt(category_id) : note.category?.id,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        className="flex flex-col border-y py-6 px-1 first:pt-2 first:border-t-transparent last:border-b-transparent"
        id={`annotation-${note.id}`}
      >
        <NoteForm
          defaultValue={note}
          hideCategory={note.parent_type === "article_concept"}
          highlightSelection={quote || undefined}
          isHighlight={note.parent_type === "article_concept"}
          onCancel={() => setIsEditing(false)}
          onSubmit={handleEditNote}
          textAreaTextSize="text-base"
          textSize="text-sm"
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col border-y py-6 first:pt-2 first:border-t-transparent last:border-b-transparent"
      id={`annotation-${note.id}`}
    >
      {deleteDialogOpen && (
        <Dialog
          action="delete this note"
          onClose={() => setDeleteDialogOpen(false)}
          onDelete={() => {
            deleteNoteMutation.mutate(note.id);
          }}
        />
      )}
      <div className="flex flex-col cursor-pointer" onClick={onClick}>
        {quote && (
          <span className="border-l-primary-500/50 border-l-4 pl-4 text-primary-700 italic text-base mb-4">
            {quote}
          </span>
        )}
        <p>{note.content}</p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          {note.category && (
            <CategoryChip
              category={note.category.name as Category}
              iconSize={12}
              showIcon={false}
              size="default"
            />
          )}
        </div>
        <div className="flex gap-x-2">
          <Button
            className="h-6 w-6"
            onClick={() => setDeleteDialogOpen(true)}
            size="icon"
            variant="destructive_ghost"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>

          <Button className="h-6 w-6" size="icon" variant="ghost">
            <EditIcon className="h-4 w-4" onClick={() => setIsEditing(true)} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MiniGenericConceptNote;
