import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { EditIcon, TrashIcon } from "lucide-react";

import { NoteDTO } from "@/client";
import DeleteDialog from "@/components/dialog/DeleteDialog";
import CategoryChip from "@/components/display/category-chip";
import { Button } from "@/components/ui/button";
import { useDeleteNote } from "@/queries/note";
import { Category } from "@/types/categories";

import NoteForm, { NoteFormType } from "./note-form";

interface NoteItemProps {
  note: NoteDTO;
  articleId: number;
  handleEditNote: (id: number) => SubmitHandler<NoteFormType>;
}

const NoteItem = ({ note, articleId, handleEditNote }: NoteItemProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const deleteNoteMutation = useDeleteNote(articleId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <div
      className="flex flex-col p-6 rounded bg-teal-50/30 border border-teal-600/40"
      id={`article-note-${note.id}`}
      key={note.id}
    >
      {deleteDialogOpen && (
        <DeleteDialog
          label="note"
          onClose={() => setDeleteDialogOpen(false)}
          onDelete={() => {
            deleteNoteMutation.mutate(note.id);
          }}
        />
      )}
      {isEditing ? (
        <NoteForm
          defaultValue={note}
          onCancel={() => setIsEditing(false)}
          onSubmit={handleEditNote(note.id)}
        />
      ) : (
        <div>
          <p className="text-lg">{note.content}</p>
          <div className="flex justify-between items-center mt-4">
            <div>
              {note.category && (
                <CategoryChip
                  category={note.category.name as Category}
                  iconSize={12}
                  showIcon={false}
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

              <Button
                className="h-6 w-6"
                onClick={() => setIsEditing(true)}
                size="icon"
                variant="ghost"
              >
                <EditIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteItem;
