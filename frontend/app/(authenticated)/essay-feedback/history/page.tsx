"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getEssays } from "@/queries/essay";

import EssayList from "./essay-list";

const EssayFeedbackHistoryPage = () => {
  const { data, isLoading } = useQuery(getEssays());
  return (
    <div className="w-full h-full flex flex-col overflow-y-auto bg-muted py-8  px-4 sm:px-8 md:px-12 xl:px-24">
      <span className="flex flex-col">
        <h1 className="text-2xl text-primary-800 font-semibold">My essays</h1>
        <div className="flex justify-between mt-2 items-center">
          <h2 className="text-primary-600">{data?.length ?? 0} notes</h2>
          <Link href="/essay-feedback">
            <Button size="sm" variant="ghost">
              New essay feedback <Plus className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </span>

      <div className="flex flex-col w-full mt-4 gap-y-4">
        <EssayList essays={data} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default EssayFeedbackHistoryPage;
