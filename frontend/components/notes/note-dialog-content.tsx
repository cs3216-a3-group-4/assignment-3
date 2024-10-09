"use client";
import { CategoryDTO, NoteDTO } from "@/client";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteNote, useEditEventNote } from "@/queries/note";
import { categoriesToDisplayName, getCategoryFor, getIconFor } from "@/types/categories";
import { parseDate } from "@/utils/date";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Chip from "@/components/display/chip";
import { z } from "zod";
import { SubmitHandler } from "react-hook-form";
import { Trash2Icon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Props {
    categoryData: CategoryDTO;
    noteContent: string;
    setNoteContent: Dispatch<SetStateAction<string>>;
    noteData: NoteDTO;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    handleDelete: () => void;
}

const noteSchema = z.object({
    content: z.string(),
    category_id: z.string().optional(),
});

type NoteType = z.infer<typeof noteSchema>;

const NoteDialogContent = ({categoryData, noteContent, setNoteContent, noteData, open, setOpen, handleDelete}: Props) => {
    const Icon = getIconFor(categoryData.name);
    const category = getCategoryFor(categoryData.name);
    const dateCreated = new Date(noteData.created_at);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const deleteNoteMutation = useDeleteNote(noteData.parent_id);
    const editNoteMutation = useEditEventNote(noteData.parent_id);
    const [pendingNoteContent, setPendingNoteContent] = useState<string>(noteContent);

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
            category_id: categoryData.id.toString()
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
                        <Icon 
                            className="mr-3 flex-shrink-0"
                            size={25}
                            strokeWidth={1.7}
                        />
                        <Chip
                            className="w-fit"
                            label={categoriesToDisplayName[category]}
                            size="lg"
                            variant="primary"
                        />
                    </div>
                </DialogTitle>
                <DialogDescription>
                    {parseDate(dateCreated)}
                </DialogDescription>
            </DialogHeader>
            {!isEditing ? (
                    <div className="flex flex-col gap-4 align-center" onDoubleClick={handleDoubleClick}>
                        <p className="text-text-muted/90">
                            {noteContent}
                        </p>
                    </div>
                ) : (
                    <Textarea
                        className="w-full"
                        placeholder="Write your notes here..."
                        value={pendingNoteContent}
                        onChange={(event) => setPendingNoteContent(event.target.value)}
                        autoFocus
                    />
            )}
            <DialogFooter>
                <div className="flex justify-between w-full">
                    <Button type="button" variant="outline" onClick={onClickDelete}>
                        <Trash2Icon size={20} strokeWidth={1.7} />
                    </Button>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
                        <Button type="button" onClick={handleSave}>Save</Button>
                    </div>
                </div>
            </DialogFooter>
        </DialogContent>
    );
};

export default NoteDialogContent;
