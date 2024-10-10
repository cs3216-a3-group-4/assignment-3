import { NoteDTO, src__events__schemas__AnalysisDTO } from "@/client";
import CategoryChip from "@/components/display/category-chip";
import NotesCategoryItem from "@/components/notes/notes-category-item";
import { Button } from "@/components/ui/button";
import { useDeleteNote } from "@/queries/note";
import { Category } from "@/types/categories";
import { TrashIcon } from "lucide-react";

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
    note.start_index &&
    note.end_index &&
    analysis.content.slice(note.start_index, note.end_index + 1);

  const onClick = () => {
    if (analysis) {
      document
        .getElementById("analysis-" + analysis.id)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
    } else if (note.parent_type === "event") {
      document
        .getElementById(`event-note-${note.id}`)
        ?.scrollIntoView({
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
      <div onClick={onClick} className="flex flex-col cursor-pointer">
        {quote && (
          <span className="border-l-primary-500/50 border-l-4 pl-4 text-primary-700 italic text-base mb-4">
            {quote}
          </span>
        )}
        <p>{note.content}</p>
      </div>

      <div className="flex justify-between items-center mt-4">
        {note.category && (
          <CategoryChip
            category={note.category.name as Category}
            size="default"
            iconSize={12}
            showIcon={false}
          />
        )}
        <div>
          <Button
            size="icon"
            variant="destructive_ghost"
            className="h-6 w-6"
            onClick={() => deleteNoteMutation.mutate(note.id)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MiniGenericAnalysisNote;
