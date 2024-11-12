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

const DailyPracticeCard = () => {
  const { data, isLoading } = useQuery(getTodaysDailyPractice());

  return (
    <div className="hidden md:flex md: flex-col md:py-6 px-8 w-full h-fit bg-card border">
      <h2 className="text-lg md:text-3xl font-semibold justify-between align-center">
        <span className="flex gap-2 items-baseline text-primary-800">
          Your daily GP practice
        </span>
      </h2>

      {/* <p className="mt-4 text-text-muted">
        Daily bite-sized exercise to flex those writing muscles and engage with
        the issues shaping our world today. Whether you're on the go, taking a
        break, or just looking to stay sharp, these quick exercises help you
        build your writing skills and think critically about current events.
      </p> */}

      <div className="flex flex-col px-12 py-6 rounded-lg bg-[#e0ebef] mt-6">
        <span className="mb-2 text-text-muted/90 font-[450]">
          {parseLongDateNoYear(Date.now())}
        </span>

        <h3 className="text-2xl text-[#236780] font-medium mb-4">
          Today’s practice dives into the ethical questions behind what we eat.
        </h3>

        <div className="flex items-center text-lg text-[#416978] px-6 py-4 bg-[#ecf4f8] w-fit max-w-full rounded-xl font-[450]">
          Ready to rethink the impact of the chicken industry?
          <Button className="ml-8 text-base" variant="secondary">
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
    </div>
  );
};

export default DailyPracticeCard;
