import { NoteDTO, src__events__schemas__AnalysisDTO } from "@/client";
import CategoryChip from "@/components/display/category-chip";
import NotesCategoryItem from "@/components/notes/notes-category-item";
import { Category } from "@/types/categories";

interface MiniGenericAnalysisNoteProps {
  note: NoteDTO;
  eventAnalysis: src__events__schemas__AnalysisDTO[];
}

const MiniGenericAnalysisNote = ({
  note,
  eventAnalysis,
}: MiniGenericAnalysisNoteProps) => {
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
      document.getElementById("analysis-" + analysis.id)?.scrollIntoView();
    } else if (note.parent_type === "event") {
      document.getElementById(`event-note-${note.id}`)?.scrollIntoView();
    }
  };

  return (
    <div
      className="flex flex-col border-y py-6 first:border-t-transparent last:border-b-transparent cursor-pointer"
      onClick={onClick}
    >
      {quote && (
        <span className="border-l-primary-500/50 border-l-4 pl-4 text-primary-700 italic text-base mb-4">
          {quote}
        </span>
      )}
      <p>{note.content}</p>
      {note.category && (
        <div className="mt-4">
          <CategoryChip
            category={note.category.name as Category}
            size="default"
            iconSize={12}
            showIcon={false}
          />
        </div>
      )}
    </div>
  );
};

export default MiniGenericAnalysisNote;
