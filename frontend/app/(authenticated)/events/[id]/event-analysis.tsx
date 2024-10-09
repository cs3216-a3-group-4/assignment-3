"use client";

import { LegacyRef, useEffect, useRef, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { SparklesIcon } from "lucide-react";

import {
  EventDTO,
  src__events__schemas__AnalysisDTO as AnalysisDTO,
} from "@/client";
import LikeButtons from "@/components/likes/like-buttons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useLikeEvent } from "@/queries/like";
import { useAddAnalysisNote, useDeleteNote } from "@/queries/note";
import { useUserStore } from "@/store/user/user-store-provider";
import {
  categoriesToDisplayName,
  categoriesToIconsMap,
  Category,
  getCategoryFor,
} from "@/types/categories";

import NoteForm, { NoteFormType } from "./note-form";

interface HighlightSelection {
  analysisId: number;
  startIndex: number;
  endIndex: number;
}

enum HighlightType {
  None,
  Annotation,
  Selected,
}

interface Region {
  startIndex: number;
  endIndex: number;
  highlighted: HighlightType;
}

interface Props {
  event: EventDTO;
}

const addNotHighlightedRegion = (regions: Region[], length: number) => {
  const result = regions.reduce(
    (prev: Region[], curr: Region) => {
      if (prev.length === 0) {
        return [curr];
      }
      if (
        curr.startIndex <= prev[prev.length - 1].endIndex + 1 &&
        prev[prev.length - 1].highlighted === curr.highlighted
      ) {
        prev[prev.length - 1].endIndex = Math.max(
          curr.endIndex,
          prev[prev.length - 1].endIndex,
        );
        return prev;
      }
      return [
        ...prev,
        {
          startIndex: prev[prev.length - 1].endIndex + 1,
          endIndex: curr.startIndex - 1,
          highlighted: HighlightType.None,
        },
        curr,
      ];
    },
    (regions.length === 0
      ? ([
          {
            startIndex: 0,
            endIndex: length - 1,
            highlighted: HighlightType.None,
          },
        ] as Region[])
      : regions[0].startIndex === 0
        ? []
        : [
            {
              startIndex: 0,
              endIndex: regions[0].startIndex - 1,
              highlighted: HighlightType.None,
            },
          ]) as Region[],
  );
  if (result[result.length - 1].endIndex != length - 1) {
    result.push({
      startIndex: result[result.length - 1].endIndex + 1,
      endIndex: length - 1,
      highlighted: HighlightType.None,
    });
  }
  console.log("notselected", { regions, result });
  return result;
};

const addSelectedRegion = (start: number, end: number, regions: Region[]) => {
  const result = [] as Region[];
  let added = false;
  for (const region of regions) {
    // no intersection
    if (region.startIndex > end || region.endIndex < start) {
      result.push(region);
      continue;
    }
    // four cases of collision
    if (region.startIndex < start) {
      result.push({
        startIndex: region.startIndex,
        endIndex: start - 1,
        highlighted: region.highlighted,
      });
    }
    if (!added) {
      result.push({
        startIndex: start,
        endIndex: end,
        highlighted: HighlightType.Selected,
      });
      added = true;
    }
    if (end < region.endIndex) {
      result.push({
        startIndex: end + 1,
        endIndex: region.endIndex,
        highlighted: region.highlighted,
      });
    }
  }
  console.log("selected", { regions, result });
  return result.filter((region) => region.startIndex <= region.endIndex);
};

const EVENT_ANALYSIS_ID_PREFIX = "event-analysis-";

const EventAnalysis = ({ event }: Props) => {
  const user = useUserStore((state) => state.user);

  const eventCategories = event.categories.map((category) =>
    getCategoryFor(category.name),
  );

  const [activeCategories, setActiveCategories] = useState<string[]>(
    event.analysises.map((item) => getCategoryFor(item.category.name)),
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

  const handleAddNote: (analysis_id: number) => SubmitHandler<NoteFormType> =
    (analysis_id: number) =>
    ({ content, category_id }) => {
      addNoteMutation.mutate(
        {
          category_id: parseInt(category_id!),
          content,
          analysis_id,
          start_index: highlightSelection!.startIndex,
          end_index: highlightSelection!.endIndex,
        },
        {
          onSuccess: () => {
            setShowAnnotationForm(false);
            setHighlightSelection(null);
          },
        },
      );
    };

  const [position, setPosition] = useState<Record<string, number>>();

  const onSelectEnd = () => {
    const selection = document.getSelection();

    if (!selection) return;

    {
      const startRange = selection.getRangeAt(0);
      const endRange = selection.getRangeAt(selection.rangeCount - 1);

      const startNode = startRange.startContainer;
      const endNode = endRange.endContainer;

      console.log("startNode", startNode);
      console.log("endNode", endNode);

      const startParent = startNode?.parentElement;
      const endParent = endNode?.parentElement;

      if (!startParent || !endParent) return;

      const parentStartIndexStr = startParent.id.split("-")[1];
      const parentEndIndexStr = endParent.id.split("-")[1];

      console.log("startParent", startParent);
      console.log("endParent", endParent);
      if (!parentStartIndexStr || !parentEndIndexStr) return;

      const startParentStartIndex = parseInt(parentStartIndexStr);
      const endParentStartIndex = parseInt(parentEndIndexStr);

      const startIndex = startParentStartIndex + startRange.startOffset;
      const endIndex = endParentStartIndex + endRange.endOffset;

      console.log("startIndex", startIndex);
      console.log("endIndex", endIndex);

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
    }

    // if (selection?.rangeCount === 0) return;

    // console.log(selection);
    // console.log(selection?.rangeCount);
    // const startRange = selection?.getRangeAt(0);
    // const endRange = selection?.getRangeAt(selection.rangeCount - 1);
    // let anchorNode = selection?.anchorNode;
    // let focusNode = selection?.focusNode;

    // // CHECK IF ITS BACKWARDS HERE, IF YES, SWAP THE TWO.
    // console.log("direction", selection.direction);
    // if (selection.direction === "backwards") {
    //   const temp = anchorNode;
    //   anchorNode = focusNode;
    //   focusNode = temp;
    // }

    // console.log("focusNode", focusNode);
    // console.log("anchorNode", anchorNode);

    // // let anchorNode = selection?.anchorNode;

    // // console.log("CLEAN", { selection });

    // // // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
    // if (anchorNode?.nodeType == 1) {
    //   // anchorNode = selection?.anchorNode; // @ts-expect-error whatever
    //   anchorNode = startRange?.startContainer;
    //   //   // hacky fix, if element node, get actual text
    //   //   anchorNode = selection?.anchorNode?.firstChild;
    // }

    // // let focusNode = selection?.focusNode;
    // if (focusNode?.nodeType == 1) {
    //   // focusNode = selection?.focusNode?.firstChild;
    //   focusNode = endRange?.endContainer; // @ts-expect-error whatever
    // }

    // if (!selection || !anchorNode || !focusNode) return;

    // const selectStartElement = anchorNode.parentElement?.parentElement;
    // if (!selectStartElement?.id?.startsWith(EVENT_ANALYSIS_ID_PREFIX)) {
    //   console.log(selectStartElement);
    //   console.log("wth 1");
    //   return;
    // }

    // // Check if focus node (where the cursor ends) is also within the analysis
    // const selectEndElement = focusNode.parentElement?.parentElement;
    // if (!selectEndElement?.id?.startsWith(EVENT_ANALYSIS_ID_PREFIX)) {
    //   console.log(focusNode);
    //   console.log(selectEndElement);
    //   // console.log("range", range);
    //   console.log("wth 2");
    //   return;
    // }

    // // https://developer.mozilla.org/en-US/docs/Web/API/Selection/type
    // // console.log(selection.type, selection.type === "Caret");
    // for (let i = 0; i < selection.rangeCount; i++) {
    //   console.log("ranges " + i, selection.getRangeAt(i));
    // }

    // if (selection.type === "Caret") {
    //   console.log("did this run?");
    //   return; // return if nothing selected
    // }

    // if (selection.type === "None") {
    //   console.log("none");
    //   return;
    // }

    // const analysisId = parseInt(
    //   selectStartElement.id.split(EVENT_ANALYSIS_ID_PREFIX)[1],
    // );

    // const anchorStart = parseInt(
    //   anchorNode.parentElement?.id.split("-")[1] as unknown as string,
    // );
    // const focusStart = parseInt(
    //   focusNode.parentElement?.id.split("-")[1] as unknown as string,
    // );

    // console.log("anchorStart", anchorStart);
    // console.log("focusStart", focusStart);

    // // if (!range) return;

    // console.log({ anchorNode, focusNode });
    // let anchorIndex = anchorStart + startRange?.startOffset;
    // let focusIndex = focusStart + endRange?.endOffset;

    // // if (anchorNode?.nodeType == 1) {
    // //   anchorIndex = anchorStart + selection.anchorOffset;
    // //   //   // hacky fix, if element node, get actual text
    // //   //   anchorNode = selection?.anchorNode?.firstChild;
    // // }

    // // // let focusNode = selection?.focusNode;
    // // if (focusNode?.nodeType == 1) {
    // //   // focusNode = selection?.focusNode?.firstChild;
    // //   focusIndex = focusStart + selection.focusOffset;
    // // }

    // console.log("anchorIndex", anchorIndex);
    // console.log("focusIndex", focusIndex);
    // console.log("selection", selection);

    // const rect = selection.getRangeAt(0).getBoundingClientRect();

    // setPosition({
    //   // 80 represents the width of the share button, this may differ for you
    //   x: rect.left + rect.width / 2 - 80 / 2,
    //   // 30 represents the height of the share button, this may differ for you
    //   y: rect.top + window.scrollY - 30,
    //   width: rect.width,
    //   height: rect.height,
    // });

    // setHighlightSelection({
    //   analysisId,
    //   startIndex: Math.min(anchorIndex, focusIndex),
    //   endIndex: Math.max(anchorIndex, focusIndex) - 1,
    // });

    selection.empty();
  };

  useEffect(() => {
    document.addEventListener("mouseup", onSelectEnd);
    document.addEventListener("touchend", onSelectEnd);
    return () => {
      document.removeEventListener("mouseup", onSelectEnd);
      document.removeEventListener("touchend", onSelectEnd);
    };
  }, []);

  const node = useRef<HTMLDivElement>();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        node &&
        node.current &&
        // @ts-expect-error not going to bother fixing type errors for code that could be deleted
        !node.current.contains(event.target)
      ) {
        console.log("u running?");
        setShowAnnotationForm(false);
        setHighlightSelection(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

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
              const categoryName = categoriesToDisplayName[category];
              const CategoryIcon = categoriesToIconsMap[category];
              return (
                <ToggleGroupItem
                  aria-label={`Toggle ${categoryName}`}
                  className="border-none bg-muted text-muted-foreground data-[state=on]:bg-cyan-400/30 data-[state=on]:text-cyan-600 rounded-xl hover:bg-cyan-200/30 hover:text-cyan-500"
                  key={category}
                  value={category}
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
          const eventAnalysis = analysis[category];
          const content = eventAnalysis.content;
          const likes = eventAnalysis.likes;
          const userLike = likes.filter((like) => like.user_id == user?.id)[0];
          const userLikeValue = userLike ? userLike.type : 0;
          const CategoryIcon = categoriesToIconsMap[category as Category];

          const highlightStartEnd = eventAnalysis.notes
            .map((notes) => ({
              startIndex: notes.start_index!,
              endIndex: notes.end_index!,
              highlighted: HighlightType.Annotation,
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
              key={category}
              value={category}
            >
              <AccordionTrigger
                chevronClassName="h-6 w-6 stroke-[2.5]"
                className="text-xl text-cyan-600 font-semibold"
              >
                <span className="flex items-center">
                  <CategoryIcon className="inline-flex mr-4" />
                  {categoriesToDisplayName[category as Category]}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-lg pt-2 text-cyan-950 font-[450] overflow-visible">
                <div>
                  <div id={`${EVENT_ANALYSIS_ID_PREFIX}${eventAnalysis.id}`}>
                    {highlightStartEndNormalised.map(
                      ({ startIndex, endIndex, highlighted }) => (
                        <>
                          {/* {highlighted === HighlightType.Selected && (
                            <Button
                              className="absolute whitespace-nowrap"
                              id="add-annotation"
                              onClick={() => setShowAnnotationForm(true)}
                              style={{
                                transform: `translate3d(${position?.x}px, ${position?.y}px, 0)`,
                              }}
                            >
                              Add annotation
                            </Button>
                          )} */}
                          <span
                            className={cn({
                              "bg-yellow-100":
                                highlighted === HighlightType.Annotation,
                              "bg-red-100":
                                highlighted === HighlightType.Selected,
                            })}
                            id={`analysis${eventAnalysis.id}-${startIndex}`}
                            key={`analysis${eventAnalysis.id}-${startIndex}`}
                          >
                            {content.slice(startIndex, endIndex + 1)}
                          </span>
                        </>
                      ),
                    )}
                  </div>
                  {highlightSelection &&
                    showAnnotationForm &&
                    highlightSelection.analysisId === eventAnalysis.id && (
                      <NoteForm
                        hideCategory
                        onSubmit={handleAddNote(eventAnalysis.id)}
                      />
                    )}
                  {eventAnalysis.notes.map((note) => (
                    <div key={note.id}>
                      {eventAnalysis.content.slice(
                        note.start_index!,
                        note.end_index!,
                      )}
                      <br />
                      {note.content}
                      <hr />
                      <Button
                        onClick={() => deleteNoteMutation.mutate(note.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
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
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default EventAnalysis;
