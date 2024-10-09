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
import { Input } from "@/components/ui/input";
import { useEditEventNote } from "@/queries/note";
import { categoriesToDisplayName, getCategoryFor, getIconFor } from "@/types/categories";
import { parseDate } from "@/utils/date";
import { Dispatch, SetStateAction, useState } from "react";
import Chip from "@/components/display/chip";
import { z } from "zod";
import { SubmitHandler } from "react-hook-form";

interface Props {
    categoryData: CategoryDTO;
    noteContent: string;
    setNoteContent: Dispatch<SetStateAction<string>>;
    noteData: NoteDTO;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const noteSchema = z.object({
    content: z.string(),
    category_id: z.string().optional(),
});

type NoteType = z.infer<typeof noteSchema>;

const NoteDialogContent = ({categoryData, noteContent, setNoteContent, noteData, open, setOpen}: Props) => {
    const Icon = getIconFor(categoryData.name);
    const category = getCategoryFor(categoryData.name);
    const dateCreated = new Date(noteData.created_at);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const editNoteMutation = useEditEventNote(noteData.parent_id);

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
        handleEditNote(noteData.id)({
            content: noteContent, 
            category_id: categoryData.id.toString()
        });
    };

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
                    <Input
                        value={noteContent}
                        onChange={(event) => setNoteContent(event.target.value)}
                        autoFocus
                    />
            )}
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
                <Button type="button" onClick={handleSave}>Save</Button>
            </DialogFooter>
        </DialogContent>
    );
};

export default NoteDialogContent;
