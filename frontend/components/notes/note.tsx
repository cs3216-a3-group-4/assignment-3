"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate } from "date-fns";

import {
  AnalysisNoteDTO,
  ArticleConceptNoteDTO,
  ArticleNoteDTO,
  EventNoteDTO,
} from "@/client";
import Chip from "@/components/display/chip";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Category, getIconFor } from "@/types/categories";
import { parseDate, parseDateNoYear } from "@/utils/date";

import NoteDialogContent from "./note-dialog-content";

type Props = {
  data: EventNoteDTO | AnalysisNoteDTO | ArticleNoteDTO | ArticleConceptNoteDTO;
  handleDelete: () => void;
};

// TODO: fix this to article url
const extractUrl = (
  note: EventNoteDTO | AnalysisNoteDTO | ArticleNoteDTO | ArticleConceptNoteDTO,
) => {
  if (note.parent_type === "event") {
    const eventNote = note as EventNoteDTO;
    const article = eventNote.event.original_article;
    return {
      article,
      url: `/articles/${article.id}`,
    };
  } else if (note.parent_type === "analysis") {
    const analysisNote = note as AnalysisNoteDTO;
    const article = analysisNote.analysis.event.original_article;
    return {
      article: article,
      url: `/articles/${article.id}#analysis-${analysisNote.analysis.id}`,
    };
  } else if (note.parent_type == "article_concept") {
    const articleConceptNote = note as ArticleConceptNoteDTO;
    const article = articleConceptNote.article_concept.article;
    return {
      article,
      url: `/articles/${article.id}`,
    };
  } else {
    const articleNote = note as ArticleNoteDTO;
    const article = articleNote.article;

    return {
      article,
      url: `/articles/${article.id}`,
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

  const { article, url: source } = extractUrl(data);

  return (
    <Dialog onOpenChange={setNoteOpen} open={noteOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center px-4 py-5 lg:flex-row w-full lg:py-3 sm:px-4 md:px-8 xl:px-12 xl:py-5 gap-x-5 border-y-[1px] lg:border-y-[0px] hover:bg-primary-alt-foreground/[2.5%] lg:rounded-md cursor-pointer">
          <div className="flex flex-col space-y-2.5 w-full">
            <div className="flex w-full justify-between">
              <Chip
                Icon={Icon}
                className="w-fit"
                label={categoryName}
                size="sm"
                variant="primary"
              />
              <span className="text-text-muted/90 text-base">
                {parseDate(dateCreated)}
              </span>
            </div>

            {data.parent_type === "analysis" && (
              <div className="border-l-primary-500/50 border-l-4 pl-4">
                {(data as AnalysisNoteDTO).analysis.content.slice(
                  data.start_index!,
                  data.end_index! + 1,
                )}
              </div>
            )}
            {data.parent_type === "article_concept" && (
              <div className="border-l-primary-500/50 border-l-4 pl-4">
                {(
                  data as ArticleConceptNoteDTO
                ).article_concept.explanation.slice(
                  data.start_index!,
                  data.end_index! + 1,
                )}
              </div>
            )}
            <p>{noteContent}</p>
            <p className="italic font-light text-sm">
              From{" "}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <span
                    className="hover:opacity-80 font-normal hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(source);
                    }}
                  >
                    {article.title} {formatDate(article.date, "(dd MMM yyyy)")}
                  </span>
                </HoverCardTrigger>
                <HoverCardContent
                  className="w-[80vw] sm:w-[50vw] cursor-default"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-full py-2 flex justify-between gap-4 md:py-0">
                    <div className="">
                      <Link href={`/articles/${article.id}`}>
                        <h4 className="text-sm md:text-lg font-medium hover:opacity-80">
                          {article.title}{" "}
                        </h4>
                      </Link>
                      <span className="font-light text-xs">
                        {parseDateNoYear(article.date)}
                      </span>
                    </div>
                    <Image
                      alt={article.title}
                      className="h-12 w-auto"
                      height={100}
                      src={article.image_url}
                      unoptimized
                      width={100}
                    />
                  </div>
                  <div className="text-xs md:text-sm text-wrap w-full mt-2">
                    {article.summary}
                  </div>
                </HoverCardContent>
              </HoverCard>
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
