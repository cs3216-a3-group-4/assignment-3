import { CategoryDTO, NoteDTO } from "@/client";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { categoriesToDisplayName, getCategoryFor, getIconFor } from "@/types/categories";
import { parseDate } from "@/utils/date";
import { Dispatch, SetStateAction } from "react";
import Chip from "@/components/display/chip";

interface Props {
    categoryData: CategoryDTO;
    noteData: NoteDTO;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const NoteDetailsDialog = ({categoryData, noteData, open, setOpen}: Props) => {
    const Icon = getIconFor(categoryData.name);
    const category = getCategoryFor(categoryData.name);
    const dateCreated = new Date(noteData.created_at);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                <div className="flex flex-col gap-4 align-center">
                    <p className="text-text-muted/90">
                        {noteData.content}
                    </p>
                </div>
                <DialogFooter>
                <Button type="submit">Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default NoteDetailsDialog;
