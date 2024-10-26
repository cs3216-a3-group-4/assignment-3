import { useLayoutEffect, useRef, useState } from "react";
import { CopyIcon, HighlighterIcon, SquareXIcon } from "lucide-react";

import { NAVBAR_HEIGHT } from "@/components/layout/app-layout";
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
  const onClose = () => clearHighlight();

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

  const spanRef = useRef<HTMLSpanElement>(null);

  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  useLayoutEffect(() => {
    if (highlighted === HighlightType.Selected && spanRef.current) {
      const rect = spanRef.current.getBoundingClientRect();

      const container = spanRef.current?.closest("#main-content");
      const scrollX = container ? container.scrollLeft : window.scrollX;
      const scrollY = container ? container.scrollTop : window.scrollY;
      const sidebarWidth =
        document.querySelector("#sidebar")?.getBoundingClientRect().width || 0;

      const top = (rect?.top || 0) + scrollY - NAVBAR_HEIGHT - 70;
      const left = (rect?.left || 0) + scrollX - sidebarWidth;

      setTop(top);
      setLeft(left);
    }
  }, [highlighted]);

  return (
    <>
      {highlighted === HighlightType.Selected && (
        <div
          className="absolute flex gap-x-4 whitespace-nowrap z-[1000] bg-card px-3 py-2 mb-2 border border-border-2 rounded cursor-pointer transition-all animate-duration-150 animate-jump-in"
          id={ANNOTATION_ACTIONS_BUTTON_ID}
          style={{
            top: top + "px",
            left: left + "px",
          }}
        >
          <button
            className="content-center flex flex-col items-center hover:bg-card-foreground/5 p-0.5 rounded-sm"
            id="add-annotation"
            onClick={onHighlight}
          >
            <HighlighterIcon className="inline-block" />
            <span className="inline-block transition-all font-medium text-sm">
              Highlight
            </span>
          </button>
          <div
            className="content-center flex flex-col items-center hover:bg-card-foreground/5 p-0.5 rounded-sm"
            onClick={onCopy}
          >
            <CopyIcon className="inline-block" />
            <span className="inline-block transition-all font-medium text-sm">
              Copy
            </span>
          </div>
          <div
            className="content-center flex flex-col items-center hover:bg-card-foreground/5 p-0.5 rounded-sm"
            onClick={onClose}
          >
            <SquareXIcon className="inline-block" />
            <span className="inline-block transition-all font-medium text-sm">
              Close
            </span>
          </div>
        </div>
      )}
      <span
        className={cn({
          "bg-yellow-100": highlighted === HighlightType.Annotation,
          "bg-blue-200 relative": highlighted === HighlightType.Selected,
        })}
        id={id}
        key={id}
        onClick={onClick}
        ref={highlighted === HighlightType.Selected ? spanRef : undefined}
      >
        {content}
      </span>
    </>
  );
};

export default AnalysisFragment;
