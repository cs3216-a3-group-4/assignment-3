"use client";

import { useQuery } from "@tanstack/react-query";
import { BicepsFlexed, Newspaper } from "lucide-react";

import CategoryChip from "@/components/display/category-chip";
import Chip from "@/components/display/chip";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTodaysDailyPractice } from "@/queries/daily-practice";
import { Category } from "@/types/categories";
import { parseLongDateNoYear } from "@/utils/date";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface TodaysPracticeCardProps {
  className?: string;
}

const TodaysPracticeCard = ({ className }: TodaysPracticeCardProps) => {
  const router = useRouter();
  const { data, isLoading } = useQuery(getTodaysDailyPractice());
  return (
    <div
      className={cn(
        "flex flex-col px-10 py-6 rounded-md bg-[#e0ebef] mt-6",
        className,
      )}
    >
      <span className="mb-2 text-text-muted/90 font-[450]">
        {parseLongDateNoYear(Date.now())}
      </span>

      <h3 className="text-2xl text-[#236780] font-medium mb-4">
        Today’s practice dives into the ethical questions behind what we eat.
      </h3>

      <div className="flex flex-col md:flex-row items-center md:justify-between text-lg text-[#416978] p-4 bg-[#ecf4f8] rounded-xl font-[450]">
        Ready to rethink the impact of the chicken industry?
        <Button
          className="w-full mt-3 md:mt-0 md:w-fit md:ml-4 text-base"
          variant="secondary"
          onClick={() => data && router.push(`/daily-practices/${data.id}`)}
        >
          <BicepsFlexed className="mr-2 h-5 w-5" /> Let&apos;s go!
        </Button>
      </div>

      <div className="flex gap-3 items-center text-text-muted/80 mt-6">
        {data?.article?.categories.map((category) => (
          <CategoryChip
            category={category.name as Category}
            className="bg-[#c7e6ef] text-[#076c89] hover:bg-[#c7e6ef]/60"
          />
        ))}
      </div>
    </div>
  );
};

export default TodaysPracticeCard;
