import {
  BookOpenTextIcon,
  FileSymlinkIcon,
  SparkleIcon,
  ZapIcon,
} from "lucide-react";

import { retryResp } from "@/app/(authenticated)/ask/temp-mocked";
import { UserQuestionMiniDTO } from "@/client";
import Chip from "@/components/display/chip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const AnswerPage = () => {
  const mockData: UserQuestionMiniDTO = retryResp;

  return (
    // TODO: @seeleng scroll to top
    <div className="flex flex-col bg-muted w-full h-full max-h-full px-4 md:px-8 xl:px-24 overflow-y-auto">
      <div className="flex flex-col pb-4 mb-4 py-8 xl:py-16 max-w-6xl md:mx-8 lg:mx-16 xl:mx-auto">
        <h1 className="px-8 md:px-0 text-2xl lg:text-3x xl:text-4xl font-semibold text-text mb-10 2xl:mb-12">
          {mockData.question}
        </h1>
        <div className="flex flex-col">
          <Accordion className="flex flex-col gap-y-4" type="multiple">
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
                    className="text-lg lg:text-xl 2xl:text-2xl text-primary font-medium text-start hover:no-underline pt-4 pb-6"
                  >
                    <div className="flex flex-col">
                      <Chip
                        // TODO @seeleng: my tag not centered pls fix thanku :clown:
                        className="inline-block mb-4 w-fit max-w-full 2xl:text-xl"
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
                      <span className="flex items-center text-lg 2xl:text-2xl px-6 2xl:px-10 pb-2 2xl:pb-0 pt-2">
                        <BookOpenTextIcon
                          className="inline-flex mr-3"
                          size={20}
                          strokeWidth={1.6}
                        />
                        <h2>Jippy Examples</h2>
                      </span>

                      {pointHasAnalysis ? (
                        <Accordion className="" type="multiple">
                          {/* TODO: get confidence score, sort and bucket */}
                          {point.point_analysises.map(
                            (point_analysis, index) => {
                              const { analysis, elaboration } = point_analysis;
                              const { id: analysisId, event } = analysis;
                              return (
                                <AccordionItem
                                  className="py-2 2xl:py-4 px-6 2xl:px-10"
                                  key={analysisId}
                                  value={analysisId.toString()}
                                >
                                  <AccordionTrigger
                                    chevronClassName="ml-4"
                                    className="text-start text-lg xl:text-xl 3xl:text-2xl text-primary-alt-800 font-medium"
                                  >
                                    {index + 1}. {event.title}
                                  </AccordionTrigger>
                                  <AccordionContent className="flex flex-col gap-y-8 2xl:gap-y-12 text-lg 2xl:text-xl 3xl:text-2xl py-2 2xl:py-4">
                                    <div className="flex flex-col gap-y-4 text-text-muted/80">
                                      <div className="flex justify-between items-baseline">
                                        <span className="font-medium text-lg 2xl:text-xl text-text-muted/80">
                                          <ZapIcon
                                            className="inline-flex mr-3"
                                            size={20}
                                          />
                                          Event summary
                                        </span>
                                        <Button
                                          className="h-8 w-fit text-text-muted mt-2"
                                          size="sm"
                                          variant="outline"
                                        >
                                          <FileSymlinkIcon className="h-4 w-4 mr-2" />
                                          Read more
                                        </Button>
                                      </div>
                                      <blockquote className="border-l-2 pl-6 italic text-text-muted 2xl:text-2xl tracking-wide">
                                        {event.description}
                                      </blockquote>
                                    </div>

                                    <div className="flex flex-col gap-y-4 mb-4">
                                      <span className="font-medium text-lg 2xl:text-xl text-text-muted/80">
                                        <SparkleIcon
                                          className="inline-flex mr-3"
                                          size={20}
                                        />
                                        Possible argument
                                      </span>
                                      <p className="tracking-wide">
                                        {elaboration}
                                      </p>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              );
                            },
                          )}
                        </Accordion>
                      ) : (
                        <div>
                          {/* TODO: @seeleng actually impleement this WITH explanation + context (why failed- no relevant etc.) */}
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
