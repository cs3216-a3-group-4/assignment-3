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
            {mockData.answer.points.map((point) => (
              <AccordionItem
                className="border border-primary/15 rounded-lg px-8 py-2 bg-background"
                key={point.id}
                value={point.id.toString()}
              >
                <AccordionTrigger
                  chevronClassName="h-6 w-6 stroke-[2.5]"
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
                  <div className="grid grid-cols-1 border-t-[0.5px] border-primary-600 pt-6 mt-2 2xl:pt-12">
                    {point.point_analysises.map((point_analysis) => (
                      <div className="mb-8">
                        {point_analysis.analysis.event.title}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* <div className="flex flex-col p-4 mb-8" key={point.id}>
              <h1 className="font-semibold text-2xl">{point.title}</h1>
              <p className="text-lg">{point.body}</p>
              <div className="flex flex-col py-4">
                {point.point_analysises.map((analysis) => (
                  <div className="flex flex-col">
                    <div>
                      <p className="text-purple-800">
                        {analysis.analysis.content}
                      </p>
                      <p className="text-blue">
                        event: {analysis.analysis.event.title}
                      </p>
                    </div>
                    <p className="text-red-500">{analysis.elaboration}</p>
                  </div>
                ))}
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default AnswerPage;
