"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  PanelRightClose,
  PanelRightOpenIcon,
  RotateCwIcon,
} from "lucide-react";

import { NAVBAR_HEIGHT } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import useBreakpointMediaQuery from "@/hooks/use-breakpoint-media-query";
import { getArticle } from "@/queries/article";
import { useReadEvent } from "@/queries/event";
import { MediaBreakpoint } from "@/utils/media";

import ArticleDetails from "./article-details";
import ArticleSource from "./article-source";
import ArticleSummary from "./article-summary";
import EventBookmarkButton from "./event-bookmark-button";

const Page = ({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id);
  const { data, isLoading } = useQuery(getArticle(id));
  const mediaQuery = useBreakpointMediaQuery();

  const readEventMutation = useReadEvent(id);
  const [sentRead, setSentRead] = useState(false);
  const [first, setFirst] = useState(true);

  const showPanelAsSheet =
    mediaQuery === MediaBreakpoint.Lg ||
    mediaQuery === MediaBreakpoint.Md ||
    mediaQuery === MediaBreakpoint.Sm;
  const [isViewAnnotation, setIsViewAnnotation] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && !sentRead) {
      readEventMutation.mutate();
      setSentRead(true);
    }
  }, [isLoading, readEventMutation, sentRead]);

  useEffect(() => {
    if (!data || !first) {
      return;
    }

    setFirst(false);

    if (
      data.notes.length > 0 ||
      data.article_concepts.flatMap((concept) => concept.concept).length > 0
    ) {
      setIsViewAnnotation(!showPanelAsSheet);
    }
  }, [data, first, showPanelAsSheet]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full">
        <LoadingSpinner className="w-24 h-24" />
      </div>
    );
  }

  if (data === undefined) {
    return (
      <div className="w-full min-h-full bg-muted px-8 md:px-16 xl:px-56 py-8">
        <div className="px-16 py-10 bg-background border border-border rounded-lg">
          <h1 className="text-3xl font-semibold">
            Uh oh... something went wrong
          </h1>
          <p className="text-xl mt-3 mb-2">
            Jippy ran into an error fetching the event you requested.
          </p>
          <p>
            If this error persists, please let us know at{" "}
            <a className="underline" href="mailto:jippythefrog@gmail.com">
              jippythefrog@gmail.com
            </a>
            .
          </p>
          <Button className="mt-6" onClick={() => location.reload()}>
            <RotateCwIcon className="h-4 w-4 mr-3" />
            Refresh page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-fit min-h-full bg-muted ${isViewAnnotation ? "relative flex" : "sm:px-8 md:px-16 xl:px-56"}`}
    >
      <div
        className={`flex flex-col bg-background ${isViewAnnotation ? (showPanelAsSheet ? "hidden" : "w-8/12 h-full mx-16") : ""}`}
      >
        <div className="flex flex-col gap-y-10">
          <div className="flex w-full max-h-52 overflow-y-clip items-center rounded-b-sm border">
            <Image
              alt={data?.title}
              height={154}
              src={data.image_url}
              style={{
                width: "100%",
                height: "fit-content",
              }}
              unoptimized
              width={273}
            />
          </div>
          <div className="px-3 md:px-8 flex flex-col gap-y-10">
            <h1 className="text-4xl font-bold px-6">{data.title}</h1>
            <ArticleDetails article={data} />
            <ArticleSummary summary={data.summary} />
            <div className="flex flex-wrap gap-x-4 gap-y-4 px-6">
              <EventBookmarkButton
                eventId={id}
                eventTitle={data.title}
                isBookmarked={data?.bookmarks.length}
              />
              <Button
                className="px-4 flex gap-x-2"
                onClick={() => setIsViewAnnotation((prev) => !prev)}
                size="lg"
                variant={isViewAnnotation ? "outline" : "default"}
              >
                {isViewAnnotation && <PanelRightClose />}
                {!isViewAnnotation && <PanelRightOpenIcon />}
                {isViewAnnotation
                  ? "View annotations on page"
                  : "View annotations on side"}
              </Button>
            </div>
          </div>
        </div>
        <div className="md:px-8 flex flex-col pb-8 gap-y-4 lg:gap-y-8">
          <Separator className="my-4 lg:my-8" />
          {data.article_concepts.map((concept) => (
            <p key={concept.concept.id}>{concept.concept.name}</p>
          ))}
          {/* <EventAnalysis event={data} showAnnotations={!isViewAnnotation} /> */}
          <Separator className="my-4 lg:my-8" />
          {/* <EventNotes event={data} /> */}
          <Separator className="my-4 lg:my-8" />
          <ArticleSource article={data} />
        </div>
      </div>
      {isViewAnnotation && (
        // h-[calc(100vh_-_84px)] min-h-[calc(100vh_-_84px)] max-h-[calc(100vh_-_84px)]
        <div
          className={
            `sticky top-0 min-h-[calc(100vh_-_${NAVBAR_HEIGHT}px)] max-h-[calc(100vh_-_${NAVBAR_HEIGHT}px)] ` +
            (showPanelAsSheet ? "absolute right-0 w-full" : "flex w-4/12 ")
          }
        >
          {/* <EventAnnotations
            event={data}
            hideAnnotationsPanel={() => setIsViewAnnotation(false)}
          /> */}
        </div>
      )}
    </div>
  );
};

export default Page;
