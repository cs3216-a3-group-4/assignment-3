import { Calendar, Dumbbell } from "lucide-react";

import TodaysPracticeCard from "@/components/daily-practice/todays-practice-card";
import { parseLongDateNoYear } from "@/utils/date";

const PastQuestionPage = () => {
  return (
    <div className="flex w-full p-4 sm:p-8 bg-muted overflow-y-auto min-h-full text-text">
      <div className="flex flex-col py-6 lg:py-10 w-full h-fit md:mx-8 xl:mx-24 bg-background rounded-lg border border-border px-8 sm:px-12 md:px-16 xl:px-20">
        <h1 className="text-3xl font-semibold flex items-center">
          <Dumbbell className="h-6 w-6 mr-3" />
          Past daily practice questions
        </h1>
        <p className="mt-3 text-text-muted text-lg">
          Past daily practice questions show up here
        </p>

        <div className="mt-6">
          <div className="flex items-center mb-3 justify-between">
            <h2 className="flex items-center font-medium text-xl py-2">
              <Calendar className="h-5 w-5 mr-2" />
              {parseLongDateNoYear(Date.now())}&apos;s practice
            </h2>
          </div>

          <TodaysPracticeCard className="mt-0" />
        </div>
      </div>
    </div>
  );
};

export default PastQuestionPage;
