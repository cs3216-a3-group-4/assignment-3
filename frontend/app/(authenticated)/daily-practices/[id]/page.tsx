"use client";

import { Separator } from "@/components/ui/separator";
import { getDailyPractice } from "@/queries/daily-practice";
import { parseLongDateNoYear } from "@/utils/date";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import ArticleCard from "../../home/article-card";
import { useRouter } from "next/navigation";

const DailyPracticePage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const id = parseInt(params.id);
  const { data: dailyPractice, isLoading } = useQuery(getDailyPractice(id));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!dailyPractice) {
    return <div>Not found</div>;
  }

  return (
    <div className="flex w-full p-4 sm:p-8 bg-muted overflow-y-auto min-h-full text-text">
      <div className="flex flex-col py-6 lg:py-10 w-full h-fit md:mx-8 xl:mx-24 bg-background rounded-lg border border-border px-8 sm:px-12 md:px-16 xl:px-20">
        <div
          className="flex text-sm font-medium items-center -mx-2 p-2 hover:bg-gray-100 rounded-lg w-fit cursor-pointer"
          onClick={() => router.push("/daily-practices")}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          <span>Back to daily practices</span>
        </div>

        <div className="mt-4">
          <h2 className="text-2xl font-semibold">
            Ethics of the Chicken Industry
          </h2>
          <h3 className="text-text-muted">
            {parseLongDateNoYear(dailyPractice.date)}
          </h3>
        </div>

        <div className="mt-6">
          Today’s exercise dives into the ethical questions surrounding what we
          eat, with a focus on the chicken industry. From farming practices to
          consumer choices, you’ll explore how this industry impacts animal
          welfare, sustainability, and our own moral responsibilities. This
          topic challenges us to think about the true cost of our food and the
          ethical implications behind everyday choices.
        </div>

        <Separator className="my-6" />

        <div>
          <ArticleCard article={dailyPractice.article} />
        </div>

        <Separator className="my-6" />

        <div>
          <h4 className="text-lg font-medium">{dailyPractice.question}</h4>
        </div>
      </div>
    </div>
  );
};

export default DailyPracticePage;
