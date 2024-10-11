import { EditIcon, TrashIcon } from "lucide-react";

import { NoteDTO, src__events__schemas__AnalysisDTO } from "@/client";
import CategoryChip from "@/components/display/category-chip";
import { Button } from "@/components/ui/button";
import { useDeleteNote } from "@/queries/note";
import { Category } from "@/types/categories";

interface MiniGenericAnalysisNoteProps {
  note: NoteDTO;
  eventAnalysis: src__events__schemas__AnalysisDTO[];
  eventId: number;
}

const MiniGenericAnalysisNote = ({
  note,
  eventAnalysis,
  eventId,
}: MiniGenericAnalysisNoteProps) => {
  const deleteNoteMutation = useDeleteNote(eventId);
  const analysis =
    note.parent_type === "analysis" &&
    eventAnalysis.find((analysis) => analysis.id === note.parent_id);

  const quote =
    analysis &&
    note.start_index !== null &&
    note.end_index !== undefined &&
    note.end_index !== null &&
    analysis.content.slice(note.start_index, note.end_index + 1);

  const onClick = () => {
    if (analysis) {
      document.getElementById("analysis-" + analysis.id)?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    } else if (note.parent_type === "event") {
      document.getElementById(`event-note-${note.id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  };

  return (
    <div
      className="flex flex-col border-y py-6 first:pt-2 first:border-t-transparent last:border-b-transparent"
      id={`annotation-${note.id}`}
    >
      <div className="flex flex-col cursor-pointer" onClick={onClick}>
        {quote && (
          <span className="border-l-primary-500/50 border-l-4 pl-4 text-primary-700 italic text-base mb-4">
            {quote}
          </span>
        )}
        <p>{note.content}</p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          {note.category && (
            <CategoryChip
              category={note.category.name as Category}
              iconSize={12}
              showIcon={false}
              size="default"
            />
          )}
        </div>
        <div className="flex gap-x-2">
          <Button
            className="h-6 w-6"
            onClick={() => deleteNoteMutation.mutate(note.id)}
            size="icon"
            variant="destructive_ghost"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>

          <Button className="h-6 w-6" size="icon" variant="ghost">
            <EditIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MiniGenericAnalysisNote;
