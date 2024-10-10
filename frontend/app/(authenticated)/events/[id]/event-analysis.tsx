"use client";

import { LegacyRef, useEffect, useRef, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { CopyIcon, HighlighterIcon, SparklesIcon } from "lucide-react";

import {
  EventDTO,
  src__events__schemas__AnalysisDTO as AnalysisDTO,
} from "@/client";
import LikeButtons from "@/components/likes/like-buttons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  ScrewedUpAccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useLikeEvent } from "@/queries/like";
import { useAddAnalysisNote, useDeleteNote } from "@/queries/note";
import { useUserStore } from "@/store/user/user-store-provider";
import { Category, getCategoryFor, getIconFor } from "@/types/categories";

import NoteForm, { NoteFormType } from "./event-annotations/note-form";
import AnalysisFragment, {
  ANNOTATION_ACTIONS_BUTTON_ID,
} from "./event-annotations/analysis-fragment";
import { HighlightType, Region } from "@/types/annotations";
import {
  addNotHighlightedRegion,
  addSelectedRegion,
} from "@/utils/annotations";
import AnalysisNotes from "./event-annotations/analysis-notes";

interface HighlightSelection {
  analysisId: number;
  startIndex: number;
  endIndex: number;
}

interface Props {
  event: EventDTO;
  showAnnotations: boolean;
}

const EVENT_ANALYSIS_ID_PREFIX = "event-analysis-";

const EventAnalysis = ({ event, showAnnotations }: Props) => {
  const user = useUserStore((state) => state.user);

  const eventCategories = event.categories;

  const [activeCategories, setActiveCategories] = useState<string[]>(
    event.analysises.map((item) => item.category.name),
  );

  // todo: this should be for each analysis but without knowing what the ui wants, i can't really refactor it
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);

  // @ts-expect-error deadline doesnt give me time to bother with type errors
  const analysis: { [key in Category]: AnalysisDTO } = {};

  const [highlightSelection, setHighlightSelection] =
    useState<HighlightSelection | null>(null);

  event.analysises.forEach(
    (item) => (analysis[getCategoryFor(item.category.name)] = item),
  );

  const likeMutation = useLikeEvent(event.id);
  const addNoteMutation = useAddAnalysisNote(event.id);
  const deleteNoteMutation = useDeleteNote(event.id);

  const clearHighlight = () => {
    setShowAnnotationForm(false);
    setHighlightSelection(null);
  };

  const handleAddNote: (
    analysis_id: number,
    category_id_num: number,
  ) => SubmitHandler<NoteFormType> =
    (analysis_id: number, category_id_num: number) =>
    ({ content }) => {
      addNoteMutation.mutate(
        {
          content,
          analysis_id,
          start_index: highlightSelection!.startIndex,
          end_index: highlightSelection!.endIndex,
          category_id: category_id_num,
        },
        {
          onSuccess: clearHighlight,
        },
      );
    };

  const onSelectEnd = () => {
    const selection = document.getSelection();
    if (!selection) return;

    if (
      selection.type == "Caret" &&
      document
        .getElementById(ANNOTATION_ACTIONS_BUTTON_ID)
        ?.contains(selection.anchorNode)
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

    const analysisIdStr = startParent?.parentElement?.id.split(
      EVENT_ANALYSIS_ID_PREFIX,
    )[1];
    if (!analysisIdStr) return;
    const analysisId = parseInt(analysisIdStr);

    setHighlightSelection({
      analysisId,
      startIndex: startIndex,
      endIndex: endIndex - 1,
    });

    selection.empty();
  };

  useEffect(() => {
    document.addEventListener("mouseup", onSelectEnd);
    document.addEventListener("touchend", onSelectEnd);
    return () => {
      document.removeEventListener("mouseup", onSelectEnd);
      document.removeEventListener("touchend", onSelectEnd);
    };
  }, [showAnnotationForm]);

  return (
    <div className="flex flex-col px-6 gap-y-8">
      <div className="flex flex-col gap-y-1">
        <span className="flex items-center font-medium text-3xl mb-6">
          <SparklesIcon className="inline-flex mr-3 stroke-offblack fill-muted" />
          AI-powered topical analysis
        </span>
        <div className="flex w-full">
          <ToggleGroup
            className="flex flex-col sm:flex-row flex-wrap md:flex-row gap-3"
            onValueChange={(value) => setActiveCategories(value)}
            size="lg"
            type="multiple"
            value={activeCategories}
            variant="outline"
          >
            {eventCategories.map((category) => {
              const categoryName = category.name;
              const CategoryIcon = getIconFor(categoryName);
              return (
                <ToggleGroupItem
                  aria-label={`Toggle ${categoryName}`}
                  className="border-none bg-muted text-muted-foreground data-[state=on]:bg-cyan-400/30 data-[state=on]:text-cyan-600 rounded-xl hover:bg-cyan-200/30 hover:text-cyan-500"
                  key={category.id}
                  value={category.name}
                >
                  <span className="flex items-center">
                    <CategoryIcon className="inline-flex mr-2" size={18} />
                    {categoryName}
                  </span>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>
      </div>
      <Accordion
        className="flex flex-col gap-y-6"
        onValueChange={(value) => setActiveCategories(value)}
        type="multiple"
        value={activeCategories}
      >
        {eventCategories.map((category) => {
          const eventAnalysis = analysis[getCategoryFor(category.name)];
          const content = eventAnalysis.content;
          const likes = eventAnalysis.likes;
          const userLike = likes.filter((like) => like.user_id == user?.id)[0];
          const userLikeValue = userLike ? userLike.type : 0;
          const CategoryIcon = getIconFor(category.name);

          const highlightStartEnd = eventAnalysis.notes
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

          if (
            highlightSelection &&
            highlightSelection.analysisId == eventAnalysis.id
          ) {
            highlightStartEndNormalised = addSelectedRegion(
              highlightSelection.startIndex,
              highlightSelection.endIndex,
              highlightStartEndNormalised,
            );
          }

          return (
            <AccordionItem
              className="border rounded-lg px-8 py-2 border-cyan-600/60 bg-cyan-50/30"
              id={"analysis-" + eventAnalysis.id}
              key={category.id}
              value={category.name}
            >
              <AccordionTrigger
                chevronClassName="h-6 w-6 stroke-[2.5]"
                className="text-xl text-cyan-600 font-semibold"
              >
                <span className="flex items-center">
                  <CategoryIcon className="inline-flex mr-4" />
                  {category.name}
                </span>
              </AccordionTrigger>
              <div className="relative">
                <ScrewedUpAccordionContent className="text-lg pt-2 text-cyan-950 font-[450]">
                  <div>
                    <div id={`${EVENT_ANALYSIS_ID_PREFIX}${eventAnalysis.id}`}>
                      {highlightStartEndNormalised.map(
                        ({
                          startIndex,
                          endIndex,
                          highlighted,
                          highlightedNoteId,
                        }) => (
                          <AnalysisFragment
                            content={content.slice(startIndex, endIndex + 1)}
                            highlighted={highlighted}
                            id={`analysis${eventAnalysis.id}-${startIndex}`}
                            key={`analysis${eventAnalysis.id}-${startIndex}`}
                            setShowAnnotationForm={setShowAnnotationForm}
                            clearHighlight={clearHighlight}
                            highlightedNoteId={highlightedNoteId}
                          />
                        ),
                      )}
                    </div>
                  </div>
                  <LikeButtons
                    onDislike={() =>
                      likeMutation.mutate({
                        analysis_id: eventAnalysis.id,
                        type: -1,
                      })
                    }
                    onLike={() =>
                      likeMutation.mutate({
                        analysis_id: eventAnalysis.id,
                        type: 1,
                      })
                    }
                    userLikeValue={userLikeValue}
                  />
                  {highlightSelection &&
                    showAnnotationForm &&
                    highlightSelection.analysisId === eventAnalysis.id && (
                      <div className="p-6 mt-4 border border-primary-500/30 rounded-md">
                        <div className="flex items-center mb-3 text-primary-800">
                          <h1 className="font-medium">Add new highlight</h1>
                        </div>
                        <NoteForm
                          hideCategory
                          isHighlight
                          onSubmit={handleAddNote(
                            eventAnalysis.id,
                            category.id,
                          )}
                          onCancel={clearHighlight}
                          highlightSelection={
                            (highlightSelection &&
                              highlightSelection.analysisId ===
                                eventAnalysis.id &&
                              eventAnalysis.content.slice(
                                highlightSelection.startIndex,
                                highlightSelection.endIndex + 1,
                              )) ||
                            undefined
                          }
                        />
                      </div>
                    )}
                  {showAnnotations && (
                    <AnalysisNotes
                      notes={eventAnalysis.notes}
                      eventAnalysisContent={eventAnalysis.content}
                      showNoteForm={
                        (highlightSelection &&
                          showAnnotationForm &&
                          highlightSelection.analysisId === eventAnalysis.id) ??
                        false
                      }
                      onDelete={(noteId: number) =>
                        deleteNoteMutation.mutate(noteId)
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

export default EventAnalysis;
