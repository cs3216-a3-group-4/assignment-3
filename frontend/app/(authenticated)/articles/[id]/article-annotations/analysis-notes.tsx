import { createElement, useEffect, useState } from "react";
import {
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  EllipsisVerticalIcon,
  HighlighterIcon,
  TrashIcon,
} from "lucide-react";

import { NoteDTO } from "@/client";
import DeleteDialog from "@/components/dialog/DeleteDialog";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface AnalysisNoteProps {
  notes: NoteDTO[];
  eventAnalysisContent: string;
  showNoteForm: boolean;
  onDelete: (noteId: number) => void;
}

const AnalysisNotes = ({
  notes,
  eventAnalysisContent,
  showNoteForm,
  onDelete,
}: AnalysisNoteProps) => {
  const numNotes = notes.length;
  const [showHighlights, setShowHighlights] = useState<boolean>(false);

  // This is scuffed, but it's the id of the note so I can use it in onDelete.
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(0);

  useEffect(() => {
    if (showNoteForm) setShowHighlights(true);
  }, [showNoteForm]);

  return (
    <div>
      {deleteDialogOpen ? (
        <DeleteDialog
          label="note"
          onClose={() => setDeleteDialogOpen(0)}
          onDelete={() => onDelete(deleteDialogOpen)}
        />
      ) : (
        <></>
      )}
      <Separator className="my-4" />
      <div
        className="flex items-center justify-between mb-2 text-cyan-800 cursor-pointer"
        onClick={() => setShowHighlights((prevState) => !prevState)}
      >
        <span className="flex items-center gap-x-2">
          <HighlighterIcon />
          <h2 className="font-medium">Your highlights ({numNotes})</h2>
        </span>
        {numNotes > 0 && (
          <span>
            {createElement(
              showHighlights ? ChevronsUpDownIcon : ChevronsDownUpIcon,
              {
                size: 20,
                strokeWidth: 2.4,
              },
            )}
          </span>
        )}
      </div>

      {showHighlights && numNotes > 0 && (
        <div className="flex flex-col gap-y-2 mt-4 px-4">
          {notes.map((note) => (
            <div
              className="flex flex-col gap-y-3 py-4 border-b-2 border-border last:border-none"
              id={"annotation-" + note.id}
              key={note.id}
            >
              <div className="flex gap-x-2 justify-between pb-1">
                <span className="border-l-primary-500/50 border-l-4 pl-4 text-primary-700 italic text-base">
                  {eventAnalysisContent.slice(
                    note.start_index!,
                    note.end_index! + 1,
                  )}
                </span>
                <Popover>
                  <PopoverTrigger className="h-fit">
                    <EllipsisVerticalIcon className="h-4 w-4" />
                  </PopoverTrigger>
                  <PopoverContent className="w-32 p-2">
                    <div className="flex flex-col">
                      <Button
                        className="border-none"
                        onClick={() => setDeleteDialogOpen(note.id)}
                        variant="destructive_outline"
                      >
                        <TrashIcon className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-primary-800">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisNotes;
