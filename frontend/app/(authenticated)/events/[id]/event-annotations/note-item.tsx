import { NoteDTO } from "@/client";
import CategoryChip from "@/components/display/category-chip";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/categories";
import { TrashIcon, EditIcon } from "lucide-react";
import NoteForm, { NoteFormType } from "./note-form";
import { useDeleteNote } from "@/queries/note";
import { SubmitHandler } from "react-hook-form";
import { useState } from "react";

interface NoteItemProps {
  note: NoteDTO;
  eventId: number;
  handleEditNote: (id: number) => SubmitHandler<NoteFormType>;
}

const NoteItem = ({ note, eventId, handleEditNote }: NoteItemProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const deleteNoteMutation = useDeleteNote(eventId);

  return (
    <div
      key={note.id}
      id={`event-note-${note.id}`}
      className="flex flex-col p-6 rounded bg-teal-50/30 border border-teal-600/40"
    >
      {isEditing ? (
        <NoteForm
          onSubmit={handleEditNote(note.id)}
          onCancel={() => setIsEditing(false)}
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
                size="icon"
                variant="destructive_ghost"
                className="h-6 w-6"
                onClick={() => deleteNoteMutation.mutate(note.id)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => setIsEditing(true)}
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
