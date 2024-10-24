"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "date-fns";

import { AnalysisNoteDTO, ArticleNoteDTO, EventNoteDTO } from "@/client";
import Chip from "@/components/display/chip";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Category, getIconFor } from "@/types/categories";
import { parseDate } from "@/utils/date";

import NoteDialogContent from "./note-dialog-content";

type Props = {
  data: EventNoteDTO | AnalysisNoteDTO | ArticleNoteDTO;
  handleDelete: () => void;
};

// TODO: fix this to article url
const extractUrl = (note: EventNoteDTO | AnalysisNoteDTO | ArticleNoteDTO) => {
  if (note.parent_type === "event") {
    const eventNote = note as EventNoteDTO;
    return { event: eventNote.event, url: `/events/${eventNote.event.id}` };
  } else {
    const analysisNote = note as AnalysisNoteDTO;
    return {
      event: analysisNote.analysis.event,
      url: `/events/${analysisNote.analysis.event.id}#analysis-${analysisNote.analysis.id}`,
    };
  }
};

const Note = ({ data, handleDelete }: Props) => {
  const categoryName = data.category ? data.category.name : Category.Others;
  const Icon = getIconFor(categoryName);
  const dateCreated = new Date(data.created_at);
  const [noteOpen, setNoteOpen] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState(data.content);
  const invalidCategory = { id: -1, name: Category.Others };
  const router = useRouter();

  // TODO: temporarily stop crash from article notes... by hiding them completely
  if (data.parent_type === "article") {
    return <></>;
  }

  const { event, url: source } = extractUrl(data);

  return (
    <Dialog onOpenChange={setNoteOpen} open={noteOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center py-5 lg:flex-row w-full lg:py-3 px-4 md:px-8 xl:px-12 xl:py-5 gap-x-5 border-y-[1px] lg:border-y-[0px] hover:bg-primary-alt-foreground/[2.5%] lg:rounded-md cursor-pointer">
          <Icon className="mr-3 flex-shrink-0" size={30} strokeWidth={1.7} />
          <div className="flex flex-col space-y-2.5">
            <div className="flex w-full justify-between">
              <span className="text-text-muted/90">
                {parseDate(dateCreated)}
              </span>
            </div>
            <Chip
              className="w-fit"
              label={categoryName}
              size="sm"
              variant="primary"
            />
            {data.parent_type === "analysis" && (
              <div className="border-l-primary-500/50 border-l-4 pl-4">
                {(data as AnalysisNoteDTO).analysis.content.slice(
                  data.start_index!,
                  data.end_index! + 1,
                )}
              </div>
            )}
            <p>{noteContent}</p>
            <p>
              From{" "}
              <span className="underline" onClick={() => router.push(source)}>
                {event.title}{" "}
                {formatDate(event.original_article.date, "(dd MMM yyyy)")}
              </span>
            </p>
          </div>
        </div>
      </DialogTrigger>
      <NoteDialogContent
        categoryData={data.category || invalidCategory}
        handleDelete={handleDelete}
        noteContent={noteContent}
        noteData={data}
        open={noteOpen}
        setNoteContent={setNoteContent}
        setOpen={setNoteOpen}
      />
    </Dialog>
  );
};

export default Note;
