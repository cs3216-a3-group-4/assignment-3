"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { Trash2Icon } from "lucide-react";
import { z } from "zod";

import {
  AnalysisNoteDTO,
  ArticleConceptNoteDTO,
  ArticleNoteDTO,
  CategoryDTO,
  EventNoteDTO,
} from "@/client";
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
import { useEditEventNote } from "@/queries/note";
import { Category, getIconFor } from "@/types/categories";
import { parseDate } from "@/utils/date";

interface Props {
  noteContent: string;
  setNoteContent: Dispatch<SetStateAction<string>>;
  noteData:
    | EventNoteDTO
    | AnalysisNoteDTO
    | ArticleNoteDTO
    | ArticleConceptNoteDTO;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleDelete: () => void;
  categoryData?: CategoryDTO | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noteSchema = z.object({
  content: z.string(),
  category_id: z.number().optional(),
});

type NoteType = z.infer<typeof noteSchema>;

const NoteDialogContent = ({
  noteContent,
  setNoteContent,
  noteData,
  open,
  handleDelete,
  categoryData,
}: Props) => {
  const categoryName = categoryData ? categoryData.name : Category.Others;
  const Icon = getIconFor(categoryName);
  const dateCreated = new Date(noteData.created_at);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const editNoteMutation = useEditEventNote(noteData.parent_id);
  const [pendingNoteContent, setPendingNoteContent] =
    useState<string>(noteContent);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleEditNote: (id: number) => SubmitHandler<NoteType> =
    (id: number) =>
    ({ content, category_id }) => {
      editNoteMutation.mutate({
        id,
        content,
        category_id: category_id,
      });
    };

  const handleSave = () => {
    setIsEditing(false);
    setNoteContent(pendingNoteContent);
    handleEditNote(noteData.id)({
      content: pendingNoteContent,
      category_id: categoryData?.id,
    });
  };

  useEffect(() => {
    setPendingNoteContent(noteContent);
    setIsEditing(false);
    setIsDeleting(false);
  }, [open, noteContent]);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          <div className="flex items-center">
            <Icon className="mr-3 flex-shrink-0" size={25} strokeWidth={1.7} />
            <Chip
              className="w-fit"
              label={categoryName}
              size="lg"
              variant="primary"
            />
          </div>
        </DialogTitle>
        <DialogDescription className="text-left">
          {parseDate(dateCreated)}
        </DialogDescription>
      </DialogHeader>
      {!isEditing && !isDeleting ? (
        <div
          className="flex flex-col gap-4 align-center"
          onDoubleClick={handleDoubleClick}
        >
          <p className="text-text-muted/90">{noteContent}</p>
        </div>
      ) : isEditing ? (
        <Textarea
          autoFocus
          className="w-full"
          onChange={(event) => setPendingNoteContent(event.target.value)}
          placeholder="Write your notes here..."
          value={pendingNoteContent}
        />
      ) : (
        <div
          className="flex flex-col gap-4 align-center"
          onDoubleClick={handleDoubleClick}
        >
          <p className="text-text-muted/90">
            Are you sure you want to delete this note?
          </p>
        </div>
      )}
      <DialogFooter>
        {!isDeleting && (
          <div className="flex justify-between w-full">
            <Button
              onClick={() => {
                setIsDeleting(true);
                setIsEditing(false);
              }}
              type="button"
              variant="outline"
            >
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
        )}
        {isDeleting && (
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setIsEditing(true);
                  setIsDeleting(false);
                }}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={handleDelete} type="button">
                Yes, delete
              </Button>
            </div>
          </div>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

export default NoteDialogContent;
