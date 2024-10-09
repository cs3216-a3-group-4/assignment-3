"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { Trash2Icon } from "lucide-react";
import { z } from "zod";

import { CategoryDTO, NoteDTO } from "@/client";
import Chip from "@/components/display/chip";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteNote, useEditEventNote } from "@/queries/note";
import {
  categoriesToDisplayName,
  getCategoryFor,
  getIconFor,
} from "@/types/categories";
import { parseDate } from "@/utils/date";

interface Props {
  categoryData: CategoryDTO;
  noteContent: string;
  setNoteContent: Dispatch<SetStateAction<string>>;
  noteData: NoteDTO;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleDelete: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noteSchema = z.object({
  content: z.string(),
  category_id: z.string().optional(),
});

type NoteType = z.infer<typeof noteSchema>;

const NoteDialogContent = ({
  categoryData,
  noteContent,
  setNoteContent,
  noteData,
  open,
  setOpen,
  handleDelete,
}: Props) => {
  const Icon = getIconFor(categoryData.name);
  const category = getCategoryFor(categoryData.name);
  const dateCreated = new Date(noteData.created_at);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const deleteNoteMutation = useDeleteNote(noteData.parent_id);
  const editNoteMutation = useEditEventNote(noteData.parent_id);
  const [pendingNoteContent, setPendingNoteContent] =
    useState<string>(noteContent);

  const onClickDelete = () => {
    deleteNoteMutation.mutate(noteData.id);
    setOpen(false);
    handleDelete();
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleEditNote: (id: number) => SubmitHandler<NoteType> =
    (id: number) =>
    ({ content, category_id }) => {
      editNoteMutation.mutate({
        id,
        category_id: parseInt(category_id!),
        content,
      });
    };

  const handleSave = () => {
    setIsEditing(false);
    setNoteContent(pendingNoteContent);
    handleEditNote(noteData.id)({
      content: pendingNoteContent,
      category_id: categoryData.id.toString(),
    });
  };

  useEffect(() => {
    setPendingNoteContent(noteContent);
    setIsEditing(false);
  }, [open]);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          <div className="flex items-center">
            <Icon className="mr-3 flex-shrink-0" size={25} strokeWidth={1.7} />
            <Chip
              className="w-fit"
              label={categoriesToDisplayName[category]}
              size="lg"
              variant="primary"
            />
          </div>
        </DialogTitle>
        <DialogDescription>{parseDate(dateCreated)}</DialogDescription>
      </DialogHeader>
      {!isEditing ? (
        <div
          className="flex flex-col gap-4 align-center"
          onDoubleClick={handleDoubleClick}
        >
          <p className="text-text-muted/90">{noteContent}</p>
        </div>
      ) : (
        <Textarea
          autoFocus
          className="w-full"
          onChange={(event) => setPendingNoteContent(event.target.value)}
          placeholder="Write your notes here..."
          value={pendingNoteContent}
        />
      )}
      <DialogFooter>
        <div className="flex justify-between w-full">
          <Button onClick={onClickDelete} type="button" variant="outline">
            <Trash2Icon size={20} strokeWidth={1.7} />
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsEditing(true)}
              type="button"
              variant="outline"
            >
              Edit
            </Button>
            <Button onClick={handleSave} type="button">
              Save
            </Button>
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default NoteDialogContent;
