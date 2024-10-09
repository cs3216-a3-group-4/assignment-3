"use client";

import { NoteDTO } from "@/client";
import { categoriesToDisplayName, categoriesToIconsMap, Category, getCategoryFor, getIconFor } from "@/types/categories";
import Chip from "@/components/display/chip";
import { parseDate } from "@/utils/date";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import NoteDialogContent from "./note-dialog-content";

type Props = {
    data: NoteDTO;
    handleDelete: () => void;
};

const Note = ({data, handleDelete}: Props) => {
    const Icon = getIconFor(data.category.name);
    const category = getCategoryFor(data.category.name);
    const dateCreated = new Date(data.created_at);
    const [noteOpen, setNoteOpen] = useState<boolean>(false);
    const [noteContent, setNoteContent] = useState(data.content);

    return (
        <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
            <DialogTrigger asChild>
                <div
                    className="flex items-center py-5 lg:flex-row w-full lg:py-3 px-4 md:px-8 xl:px-12 xl:py-5 gap-x-5 border-y-[1px] lg:border-y-[0px] hover:bg-primary-alt-foreground/[2.5%] lg:rounded-md cursor-pointer"
                    >
                        <Icon 
                            className="mr-3 flex-shrink-0"
                            size={30}
                            strokeWidth={1.7}/>
                        <div className="flex flex-col space-y-2.5">
                            <div className="flex w-full justify-between">
                                <span className="text-text-muted/90">{parseDate(dateCreated)}</span>
                            </div>
                            <p className="">{noteContent}</p>
                            <Chip
                                className="w-fit"
                                label={categoriesToDisplayName[category]}
                                size="lg"
                                variant="primary"
                            />
                        </div>
                </div>
            </DialogTrigger>
            <NoteDialogContent 
              categoryData={data.category}
              noteContent={noteContent}
              setNoteContent={setNoteContent}
              noteData={data}
              open={noteOpen}
              setOpen={setNoteOpen}
              handleDelete={handleDelete}
            />
            
        </Dialog>
    );
};

export default Note;