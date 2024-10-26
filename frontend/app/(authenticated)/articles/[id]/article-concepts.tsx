"use client";

import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { SparklesIcon } from "lucide-react";

import { ArticleDTO } from "@/client";
import LikeButtons from "@/components/likes/like-buttons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  ScrewedUpAccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useLikeArticle } from "@/queries/like";
import { useAddConceptNote, useDeleteNote } from "@/queries/note";
import { useUserStore } from "@/store/user/user-store-provider";
import { HighlightType } from "@/types/annotations";
import {
  addNotHighlightedRegion,
  addSelectedRegion,
} from "@/utils/annotations";

import AnalysisFragment, {
  ANNOTATION_ACTIONS_BUTTON_ID,
} from "./article-annotations/analysis-fragment";
import AnalysisNotes from "./article-annotations/analysis-notes";
import NoteForm, { NoteFormType } from "./article-annotations/note-form";

interface HighlightSelection {
  conceptId: number;
  startIndex: number;
  endIndex: number;
}

interface Props {
  article: ArticleDTO;
  showAnnotations: boolean;
}

const CONCEPT_ID_PREFIX = "concept-";

const ArticleConcepts = ({ article, showAnnotations }: Props) => {
  const user = useUserStore((state) => state.user);
  const conceptIdStrs = article.article_concepts.map((article_concept) =>
    article_concept.concept.id.toString(),
  );

  const [highlightSelection, setHighlightSelection] =
    useState<HighlightSelection | null>(null);
  // todo: this should be for each analysis but without knowing what the ui wants, i can't really refactor it
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);

  const likeMutation = useLikeArticle(article.id);
  const addNoteMutation = useAddConceptNote(article.id);
  const deleteNoteMutation = useDeleteNote(article.id);

  const clearHighlight = () => {
    setShowAnnotationForm(false);
    setHighlightSelection(null);
  };

  const handleAddNote: (concept_id: number) => SubmitHandler<NoteFormType> =
    (concept_id: number) =>
    ({ content, category_id }) => {
      addNoteMutation.mutate(
        {
          content,
          concept_id,
          start_index: highlightSelection!.startIndex,
          end_index: highlightSelection!.endIndex,
          category_id: category_id ? parseInt(category_id) : undefined,
        },
        {
          onSuccess: clearHighlight,
        },
      );
    };

  useEffect(() => {
    const onSelectEnd = () => {
      const selection = document.getSelection();
      if (!selection) return;

      if (
        selection.type === "None" ||
        (selection.type == "Caret" &&
          document
            .getElementById(ANNOTATION_ACTIONS_BUTTON_ID)
            ?.contains(selection.anchorNode))
      ) {
        return; // don't clear highlight if add-annotation button is being clicked
      }

      if (selection.type != "Range") {
        if (!showAnnotationForm) clearHighlight();
        return;
      }

      if (!selection.rangeCount) return;

      const startRange = selection.getRangeAt(0);
      const endRange = selection.getRangeAt(selection.rangeCount - 1);

      const startNode = startRange.startContainer;
      const endNode = endRange.endContainer;

      const startParent = startNode?.parentElement;
      const endParent = endNode?.parentElement;

      if (!startParent || !endParent) return;

      const parentStartIndexStr = startParent.id.split("-")[1];
      const parentEndIndexStr = endParent.id.split("-")[1];

      if (!parentStartIndexStr || !parentEndIndexStr) return;

      const startParentStartIndex = parseInt(parentStartIndexStr);
      const endParentStartIndex = parseInt(parentEndIndexStr);

      const startIndex = startParentStartIndex + startRange.startOffset;
      const endIndex = endParentStartIndex + endRange.endOffset;

      const conceptIdStr =
        startParent?.parentElement?.id.split(CONCEPT_ID_PREFIX)[1];
      if (!conceptIdStr) return;
      const conceptId = parseInt(conceptIdStr);

      setHighlightSelection({
        conceptId,
        startIndex: startIndex,
        endIndex: endIndex - 1,
      });

      selection.empty();
    };

    document.addEventListener("pointerup", onSelectEnd);
    return () => {
      document.removeEventListener("pointerup", onSelectEnd);
    };
  }, [showAnnotationForm]);

  return (
    <div className="flex flex-col px-6 gap-y-8">
      <div className="flex flex-col gap-y-1">
        <span className="flex items-center font-medium text-3xl mb-6">
          <SparklesIcon className="inline-flex mr-3 stroke-offblack fill-muted" />
          AI-powered topical analysis
        </span>
      </div>
      <Accordion
        className="flex flex-col gap-y-6"
        defaultValue={conceptIdStrs}
        type="multiple"
      >
        {article.article_concepts.map((article_concept) => {
          const content = article_concept.explanation;
          const concept = article_concept.concept;
          const likes = concept.likes;
          const userLike = likes.filter((like) => like.user_id == user?.id)[0];
          const userLikeValue = userLike ? userLike.type : 0;

          const highlightStartEnd = concept.notes
            .map((notes) => ({
              startIndex: notes.start_index!,
              endIndex: notes.end_index!,
              highlighted: HighlightType.Annotation,
              highlightedNoteId: notes.id,
            }))
            .sort((a, b) => a.startIndex - b.startIndex);

          let highlightStartEndNormalised = addNotHighlightedRegion(
            highlightStartEnd,
            content.length,
          );

          let hasSelection = false;

          if (
            highlightSelection &&
            highlightSelection.conceptId == concept.id
          ) {
            highlightStartEndNormalised = addSelectedRegion(
              highlightSelection.startIndex,
              highlightSelection.endIndex,
              highlightStartEndNormalised,
            );
            hasSelection = true;
          }

          return (
            <AccordionItem
              className={cn(
                "border rounded-lg px-8 py-2 border-cyan-600/60 bg-cyan-50/30",
                {
                  "select-none": hasSelection,
                },
              )}
              id={"concept-" + concept.id}
              key={concept.id}
              value={concept.id.toString()}
            >
              <AccordionTrigger
                chevronClassName="h-6 w-6 stroke-[2.5]"
                className="text-xl text-cyan-600 font-semibold"
              >
                <span className="flex items-center capitalize">
                  {concept.name}
                </span>
              </AccordionTrigger>
              <div>
                <ScrewedUpAccordionContent className="text-lg pt-2 text-cyan-950 font-[450]">
                  <div
                    onClick={() => {
                      if (hasSelection && showAnnotationForm) {
                        setHighlightSelection(null);
                        setShowAnnotationForm(false);
                      }
                    }}
                  >
                    <div id={`${CONCEPT_ID_PREFIX}${concept.id}`}>
                      {highlightStartEndNormalised.map(
                        ({
                          startIndex,
                          endIndex,
                          highlighted,
                          highlightedNoteId,
                        }) => (
                          <AnalysisFragment
                            clearHighlight={clearHighlight}
                            content={content.slice(startIndex, endIndex + 1)}
                            highlighted={highlighted}
                            highlightedNoteId={highlightedNoteId}
                            id={`concept${concept.id}-${startIndex}`}
                            key={`concept${concept.id}-${startIndex}`}
                            setShowAnnotationForm={setShowAnnotationForm}
                          />
                        ),
                      )}
                    </div>
                  </div>
                  <LikeButtons
                    onDislike={() =>
                      likeMutation.mutate({
                        concept_id: concept.id,
                        type: -1,
                      })
                    }
                    onLike={() =>
                      likeMutation.mutate({
                        concept_id: concept.id,
                        type: 1,
                      })
                    }
                    userLikeValue={userLikeValue}
                  />
                  {highlightSelection &&
                    showAnnotationForm &&
                    highlightSelection.conceptId === concept.id && (
                      <div className="p-6 mt-4 border border-primary-500/30 rounded-md">
                        <div className="flex items-center mb-3 text-primary-800">
                          <h1 className="font-medium">Add new highlight</h1>
                        </div>
                        <NoteForm
                          highlightSelection={
                            (highlightSelection &&
                              highlightSelection.conceptId === concept.id &&
                              content.slice(
                                highlightSelection.startIndex,
                                highlightSelection.endIndex + 1,
                              )) ||
                            undefined
                          }
                          isHighlight
                          onCancel={clearHighlight}
                          onSubmit={handleAddNote(concept.id)}
                        />
                      </div>
                    )}
                  {showAnnotations && (
                    <AnalysisNotes
                      eventAnalysisContent={content}
                      notes={concept.notes}
                      onDelete={(noteId: number) =>
                        deleteNoteMutation.mutate(noteId)
                      }
                      showNoteForm={
                        (highlightSelection &&
                          showAnnotationForm &&
                          highlightSelection.conceptId === concept.id) ??
                        false
                      }
                    />
                  )}
                </ScrewedUpAccordionContent>
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default ArticleConcepts;
