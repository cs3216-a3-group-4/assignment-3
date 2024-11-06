"use client";

import { useQuery } from "@tanstack/react-query";

import PointAccordion from "@/app/(authenticated)/answers/point-accordion";
import UserPoints from "@/app/(authenticated)/answers/user-points";
import ScrollToTopButton from "@/components/navigation/scroll-to-top-button";
import { Accordion } from "@/components/ui/accordion";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getAnswer } from "@/queries/user-question";

const AnswerPage = ({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id);
  const { data, isPending } = useQuery(getAnswer(id));

  if (isPending || !data) {
    return (
      <div className="flex justify-center items-center w-full">
        <LoadingSpinner className="w-24 h-24" />
      </div>
    );
  }

  const generatedPoints = data.answer.points.filter((point) => point.generated);

  return (
    data && (
      <div
        className="flex flex-col bg-muted w-full h-full max-h-full px-4 md:px-8 xl:px-24 overflow-y-auto"
        id="answer"
      >
        <div className="flex flex-col pb-4 mb-4 py-8 xl:py-16 max-w-6xl md:mx-8 lg:mx-16 xl:mx-auto">
          <h1 className="px-8 md:px-0 text-2xl lg:text-3x xl:text-4xl font-semibold text-text mb-10 2xl:mb-12">
            {data.question}
          </h1>
          <div className="flex flex-col">
            <Accordion className="flex flex-col gap-y-4" type="multiple">
              {/* TODO @seeleng: sort by position? for arguments first? */}
              {generatedPoints.map((point) => (
                <PointAccordion answer_id={id} key={point.id} point={point} />
              ))}
              <UserPoints answer_id={id} />
            </Accordion>
          </div>
        </div>
        <ScrollToTopButton
          className="absolute right-4 bottom-4"
          minHeight={200}
          scrollElementId="answer"
        />
      </div>
    )
  );
};

export default AnswerPage;
