import { NoteDTO } from "@/client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  DeleteIcon,
  EllipsisVerticalIcon,
  HighlighterIcon,
  TrashIcon,
} from "lucide-react";
import { createElement, useState } from "react";

interface AnalysisNoteProps {
  notes: NoteDTO[];
  eventAnalysisContent: string;
  onDelete: (noteId: number) => void;
}

const AnalysisNotes = ({
  notes,
  eventAnalysisContent,
  onDelete,
}: AnalysisNoteProps) => {
  const numNotes = notes.length;
  const [showHighlights, setShowHighlights] = useState<boolean>(true);
  if (numNotes === 0) return;
  return (
    <div>
      <Separator className="my-4" />
      <div
        className="flex items-center justify-between mb-2 text-cyan-800 cursor-pointer"
        onClick={() => setShowHighlights((prevState) => !prevState)}
      >
        <span className="flex items-center gap-x-2">
          <HighlighterIcon />
          <h2 className="font-medium">Your highlights ({numNotes})</h2>
        </span>
        <span>
          {createElement(
            showHighlights ? ChevronsUpDownIcon : ChevronsDownUpIcon,
            {
              size: 20,
              strokeWidth: 2.4,
            },
          )}
        </span>
      </div>
      {showHighlights && (
        <div className="flex flex-col gap-y-2 mt-4 px-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="flex flex-col gap-y-2 py-4 border-b-2 border-border last:border-none"
            >
              <div className="flex gap-x-2 justify-between pb-1">
                <span className="border-l-primary-500/50 border-l-4 pl-4 text-primary-700">
                  {eventAnalysisContent.slice(
                    note.start_index!,
                    note.end_index!,
                  )}
                </span>
                <Popover>
                  <PopoverTrigger className="h-fit">
                    <EllipsisVerticalIcon className="h-4 w-4" />
                  </PopoverTrigger>
                  <PopoverContent className="w-32 p-2">
                    <div className="flex flex-col">
                      <Button
                        variant="destructive_outline"
                        className="border-none"
                        onClick={() => onDelete(note.id)}
                      >
                        <TrashIcon className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <p>{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisNotes;
