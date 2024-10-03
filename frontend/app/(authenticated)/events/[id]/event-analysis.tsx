"use client";

import { useEffect, useState } from "react";
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

interface Region {
  startIndex: number;
  endIndex: number;
  highlighted: boolean;
}

interface Props {
  event: EventDTO;
}

const EventAnalysis = ({ event }: Props) => {
  const user = useUserStore((state) => state.user);

  const eventCategories = event.categories.map((category) =>
    getCategoryFor(category.name),
  );

  const [activeCategories, setActiveCategories] = useState<string[]>(
    event.analysises.map((item) => getCategoryFor(item.category.name)),
  );

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
      addNoteMutation.mutate({
        category_id: parseInt(category_id),
        content,
        analysis_id,
        start_index: highlightSelection!.startIndex,
        end_index: highlightSelection!.endIndex,
      });
    };

  useEffect(() => {
    document.addEventListener("selectionchange", () => {
      const selection = document.getSelection();
      console.log(selection?.anchorNode?.parentElement?.id);
      const id = selection?.anchorNode?.parentElement?.parentElement?.id;
      if (!id?.startsWith("event-analysis-")) {
        return;
      }
      const analysisId = parseInt(id.split("event-analysis-")[1]);
      const spanStart = parseInt(
        selection?.anchorNode?.parentElement?.id.split(
          "-",
        )[1] as unknown as string,
      );
      setHighlightSelection({
        analysisId,
        startIndex: spanStart + selection!.anchorOffset,
        endIndex: spanStart + selection!.focusOffset,
      });
    });
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
              highlighted: true,
            }))
            .sort((a, b) => a.startIndex - b.startIndex);

          console.log(highlightStartEnd.length);
          const highlightStartEndNormalised = highlightStartEnd.reduce(
            (prev, curr) => {
              console.log({ prev, curr });
              if (prev.length === 0) {
                return [curr];
              }
              if (
                curr.startIndex <= prev[prev.length - 1].endIndex + 1 &&
                prev[prev.length - 1].highlighted
              ) {
                prev[prev.length - 1].endIndex = curr.endIndex;
                return prev;
              }
              return [
                ...prev,
                {
                  startIndex: prev[prev.length - 1].endIndex + 1,
                  endIndex: curr.startIndex - 1,
                  highlighted: false,
                },
                curr,
              ];
            },
            (highlightStartEnd.length === 0
              ? [
                  {
                    startIndex: 0,
                    endIndex: content.length - 1,
                    highlighted: false,
                  },
                ]
              : highlightStartEnd[0].startIndex === 0
                ? []
                : [
                    {
                      startIndex: 0,
                      endIndex: highlightStartEnd[0].startIndex - 1,
                      highlighted: false,
                    },
                  ]) as Region[],
          );
          if (
            highlightStartEndNormalised[highlightStartEndNormalised.length - 1]
              .endIndex !=
            content.length - 1
          ) {
            highlightStartEndNormalised.push({
              startIndex:
                highlightStartEndNormalised[
                  highlightStartEndNormalised.length - 1
                ].endIndex + 1,
              endIndex: content.length - 1,
              highlighted: false,
            });
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
              <AccordionContent className="text-lg pt-2 text-cyan-950 font-[450]">
                <div>
                  <div id={`event-analysis-${eventAnalysis.id}`}>
                    {highlightStartEndNormalised.map(
                      ({ startIndex, endIndex, highlighted }) => (
                        <span
                          className={cn({ "bg-yellow-100": highlighted })}
                          id={`analysis${eventAnalysis.id}-${startIndex}`}
                          key={`analysis${eventAnalysis.id}-${startIndex}`}
                        >
                          {content[startIndex] === " " && " "}
                          {content.slice(startIndex, endIndex)}
                          {content[endIndex] === " " && " "}
                        </span>
                      ),
                    )}
                  </div>
                  {highlightSelection &&
                    highlightSelection.analysisId === eventAnalysis.id && (
                      <NoteForm onSubmit={handleAddNote(eventAnalysis.id)} />
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
                  {/* Commenting out GP questions for now */}
                  {/* <Separator className="my-4" />
                  <div>
                    How does the commercialization of global sports impact
                    societal values and economies?
                  </div> */}
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
