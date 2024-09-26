"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { getEvent } from "@/queries/event";

import EventAnalysis from "./event-analysis";
import EventDetails from "./event-details";
import EventSource from "./event-source";
import EventSummary from "./event-summary";

const Page = ({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id);
  const { data, isLoading } = useQuery(getEvent(id));

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
