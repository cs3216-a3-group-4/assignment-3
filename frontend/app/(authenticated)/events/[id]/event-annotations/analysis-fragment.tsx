import { CopyIcon, HighlighterIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { HighlightType } from "@/types/annotations";

export const ANNOTATION_ACTIONS_BUTTON_ID = "annotation-actions";

interface AnalysisFragmentProps {
  content: string;
  id: string;
  highlighted: HighlightType;
  setShowAnnotationForm: (showAnnotationForm: boolean) => void;
  clearHighlight: () => void;
  highlightedNoteId?: number;
}

const AnalysisFragment = ({
  content,
  id,
  highlighted,
  setShowAnnotationForm,
  clearHighlight,
  highlightedNoteId,
}: AnalysisFragmentProps) => {
  const onHighlight = () => setShowAnnotationForm(true);
  const onCopy = () => {
    navigator.clipboard.writeText(content);
    clearHighlight();
  };

  const onClick = () => {
    if (
      highlighted === HighlightType.Annotation &&
      highlightedNoteId !== undefined
    )
      document
        .getElementById("annotation-" + highlightedNoteId)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
  };

  return (
    <span
      className={cn({
        "bg-yellow-100": highlighted === HighlightType.Annotation,
        "bg-blue-200 relative": highlighted === HighlightType.Selected,
      })}
      id={id}
      key={id}
      onClick={onClick}
    >
      {highlighted === HighlightType.Selected && (
        <div
          className="absolute flex gap-x-4 whitespace-nowrap bottom-6 left-0 z-[1000] bg-card px-3 py-2 mb-2 border border-border-2 rounded cursor-pointer transition-all animate-duration-150 animate-jump-in"
          id={ANNOTATION_ACTIONS_BUTTON_ID}
        >
          <div
            className="content-center flex flex-col items-center hover:bg-card-foreground/5 p-0.5 rounded-sm"
            id="add-annotation"
            onClick={onHighlight}
          >
            <HighlighterIcon className="inline-block" />
            <span className="inline-block ml-2 transition-all font-medium text-sm">
              Highlight
            </span>
          </div>

          <div
            className="content-center flex flex-col items-center hover:bg-card-foreground/5 p-0.5 rounded-sm"
            onClick={onCopy}
          >
            <CopyIcon className="inline-block" />
            <span className="inline-block ml-2 transition-all font-medium text-sm">
              Copy
            </span>
          </div>
        </div>
      )}
      {content}
    </span>
  );
};

export default AnalysisFragment;
