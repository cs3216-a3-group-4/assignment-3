"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  Bookmark,
  BookmarkCheck,
  BookmarkCheckIcon,
  BookmarkMinusIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAddBookmark, useRemoveBookmark } from "@/queries/bookmark";
import { getEvent } from "@/queries/event";

import EventAnalysis from "./event-analysis";
import EventDetails from "./event-details";
import EventSource from "./event-source";
import EventSummary from "./event-summary";

const Page = ({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id);
  const { data, isLoading } = useQuery(getEvent(id));
  const bookmarked = data?.bookmarks.length === 1;

  const addBookmarkMutation = useAddBookmark(id);
  const removeBookmarkMutation = useRemoveBookmark(id);

  const toast = useToast();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full">
        <LoadingSpinner className="w-24 h-24" />
      </div>
    );
  }

  return (
    data && (
      <div className="px-8 md:px-16 xl:px-56 py-8 w-full h-fit bg-muted">
        <div className="flex flex-col bg-background">
          <div className="flex flex-col gap-y-10">
            <div className="flex w-full max-h-52 overflow-y-clip items-center rounded-t-2xl rounded-b-sm border">
              <Image
                alt={data?.title}
                height={154}
                src={data.original_article.image_url}
                style={{
                  width: "100%",
                  height: "fit-content",
                }}
                unoptimized
                width={273}
              />
            </div>
            <div className="md:px-8 flex flex-col gap-y-10">
              <h1 className="text-4xl font-bold px-6">{data.title}</h1>
              <EventDetails event={data} />
              <EventSummary summary={data.description} />
              <div className="px-6">
                {bookmarked ? (
                  <Button
                    className="flex gap-2"
                    onClick={() => {
                      removeBookmarkMutation.mutate();
                      toast.toast({
                        title: "Removed bookmark",
                        icon: <BookmarkMinusIcon />,
                        description: `Bookmark removed for ${data.title}`,
                      });
                    }}
                    variant={"default"}
                  >
                    <BookmarkCheck className="w-5 h-5" /> Bookmarked
                  </Button>
                ) : (
                  <Button
                    className="flex gap-2"
                    onClick={() => {
                      addBookmarkMutation.mutate();
                      toast.toast({
                        title: "Added bookmark",
                        icon: <BookmarkCheckIcon />,
                        description: `Bookmark added for ${data.title}`,
                      });
                    }}
                    variant={"outline"}
                  >
                    <Bookmark className="w-5 h-5" /> Bookmark
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="md:px-8 flex flex-col gap-y-10 pb-8">
            <Separator className="my-10" />
            <EventAnalysis event={data} />
            <Separator className="my-10" />
            <EventSource originalSource={data.original_article} />
          </div>
        </div>
      </div>
    )
  );
};

export default Page;
