import { retryResp } from "@/app/(authenticated)/ask/temp-mocked";
import { UserQuestionMiniDTO } from "@/client";
import Chip from "@/components/display/chip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AnswerPage = () => {
  const mockData: UserQuestionMiniDTO = retryResp;

  return (
    <div className="flex flex-col bg-muted w-full h-full max-h-full px-4 md:px-8 xl:px-24 overflow-y-auto">
      <div className="flex flex-col pb-4 mb-4 py-8 xl:py-16 max-w-5xl md:mx-8 lg:mx-16 xl:mx-auto">
        <h1 className="text-2xl lg:text-3x xl:text-4xl font-semibold text-text mb-8 2xl:mb-12">
          {mockData.question}
        </h1>
        <div className="flex flex-col">
          <Accordion type="multiple" className="flex flex-col gap-y-4">
            {/* TODO @seeleng: sort by position? for arguments first? */}
            {mockData.answer.points.map((point) => {
              const pointHasAnalysis = point.point_analysises.length > 0;
              return (
                <AccordionItem
                  className="border border-primary/15 rounded-lg px-8 py-2 2xl:px-12 2xl:py-6 bg-background"
                  key={point.id}
                  value={point.id.toString()}
                >
                  <AccordionTrigger
                    chevronClassName="h-6 w-6 stroke-[2.5] ml-4"
                    className="text-lg lg:text-xl 2xl:text-2xl text-primary font-medium text-start hover:no-underline"
                  >
                    <div className="flex flex-col">
                      <Chip
                        // TODO @seeleng: my tag not centered pls fix thanku :clown:
                        className="inline-block mb-4 w-fit max-w-full"
                        label={point.positive ? "For" : "Against"}
                        size="lg"
                        variant={point.positive ? "secondary" : "accent"}
                      />
                      <span className="inline-block text-primary-900 hover:text-primary-900/80">
                        {point.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="border-t-[0.5px] border-primary-600 mt-2 pt-4 2xl:pt-8">
                      <h2 className="text-lg 2xl:text-2xl font-medium">
                        Examples
                      </h2>

                      {pointHasAnalysis ? (
                        <Accordion
                          className=""
                          type="multiple"
                          defaultValue={point.point_analysises.map(
                            (point_analysis) =>
                              point_analysis.analysis.id.toString(),
                          )}
                        >
                          {/* TODO: get confidence score, sort and bucket */}
                          {point.point_analysises.map((point_analysis) => {
                            const { analysis, elaboration } = point_analysis;
                            const { id: analysisId, event } = analysis;
                            return (
                              <AccordionItem
                                className="py-4"
                                value={analysisId.toString()}
                                key={analysisId}
                              >
                                <AccordionTrigger className="xl:text-lg 2xl:text-xl 3xl:text-2xl font-medium">
                                  {event.title}
                                </AccordionTrigger>
                                <AccordionContent className="xl:text-base 2xl:text-lg 3xl:text-xl">
                                  <div>{elaboration}</div>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      ) : (
                        <div>
                          <h1>
                            {point.fallback?.general_argument ??
                              "No relevant analysis found"}
                          </h1>
                          <h1>
                            {point.fallback?.alt_approach ??
                              "No relevant analysis found"}
                          </h1>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default AnswerPage;
