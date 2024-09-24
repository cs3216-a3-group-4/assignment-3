"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { getEvent } from "@/queries/event";

import EventAnalysis from "./event-analysis";
import EventDetails from "./event-details";
import EventSummary from "./event-summary";

const Page = ({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id);
  const { data, isLoading, isError } = useQuery(getEvent(id));
  console.log({ data, isLoading, isError });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full">
        <LoadingSpinner className="w-24 h-24 stroke-green-700" />
      </div>
    );
  }
  return (
    data && (
      <div className="flex flex-col mx-8 md:mx-16 xl:mx-56 py-8 w-full h-fit">
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
          <h1 className="text-4xl font-bold px-6">{data.title}</h1>
          <EventDetails event={data} />
          <EventSummary summary={data.description} />
        </div>
        <Separator className="my-10" />
        <EventAnalysis event={data} />
        <Separator className="my-10" />
      </div>
    )
  );
};

export default Page;
