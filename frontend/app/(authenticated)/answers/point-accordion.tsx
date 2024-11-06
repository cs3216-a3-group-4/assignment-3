import { useState } from "react";
import { HttpStatusCode } from "axios";
import { BookOpenTextIcon, Cross, LucideRefreshCw } from "lucide-react";

import { CPointDTO, PointDTO } from "@/client";
import Chip from "@/components/display/chip";
import LikeButtons from "@/components/likes/like-buttons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import JippyIcon from "@/public/jippy-icon/jippy-icon-sm";
import { useLikePoint } from "@/queries/like";
import { useRegenerateExamples } from "@/queries/user-question";
import { useUserStore } from "@/store/user/user-store-provider";

import ExampleAccordion from "./example-accordion";

type OwnProps = {
  answer_id: number;
  point: PointDTO | CPointDTO;
};

const PointAccordion: React.FC<OwnProps> = ({ answer_id, point }) => {
  const user = useUserStore((state) => state.user);
  const likes = point.likes;
  const userLike = likes.filter((like) => like.user_id === user?.id)[0];
  const userLikeValue = userLike ? userLike.type : 0;
  const likeMutation = useLikePoint(answer_id);
  const regenerateExampleMutation = useRegenerateExamples(answer_id);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const regenerateExamples = () => {
    setIsLoading(true);
    regenerateExampleMutation.mutate(
      { point_id: point.id },
      {
        onSettled: (response) => {
          setIsLoading(false);
          if (!response || response.status !== HttpStatusCode.Ok) {
            return;
          }
          // handle whether example was generated
          const examples_generated = response.data;
          if (!examples_generated) {
            toast.toast({
              title: "Sorry, Jippy can't find any more relevant examples!",
              icon: <Cross />,
              description: `Failed to regenerate examples for "${point.title}"`,
            });
          }
        },
      },
    );
  };

  const pointHasExamples =
    (point.type === "ANALYSIS" &&
      (point as PointDTO).point_analysises.length > 0) ||
    (point.type === "CONCEPT" &&
      (point as CPointDTO).point_article_concepts.length > 0);
  return (
    <AccordionItem
      className="border border-primary/15 rounded-lg px-8 py-2 2xl:px-12 2xl:py-6 bg-background"
      key={point.id}
      value={point.id.toString()}
    >
      {isLoading && (
        <div className="absolute w-full h-full bg-slate-600/80 z-50 bottom-0 right-0 flex justify-center items-center">
          <Card className="p-8 flex flex-col justify-center items-center gap-8">
            <h1 className="text-lg">
              Jippy is regenerating examples for this point! Please wait...
            </h1>
            <JippyIcon classname="animate-bounce w-24 h-24 pt-4" />
          </Card>
        </div>
      )}
      <AccordionTrigger
        chevronClassName="h-6 w-6 stroke-[2.5] ml-4"
        className="text-lg lg:text-xl 2xl:text-2xl text-primary font-medium text-start hover:no-underline pt-4 pb-6"
      >
        <div className="flex flex-col">
          <div className="flex">
            <Chip
              // TODO @seeleng: my tag not centered pls fix thanku :clown:
              className="flex mb-4 w-fit max-w-full 2xl:text-xl"
              label={point.positive ? "For" : "Against"}
              size="lg"
              variant={point.positive ? "secondary" : "accent"}
            />
          </div>
          <span className="inline-block text-primary-900 hover:text-primary-900/80">
            {point.title}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="border-t-[0.5px] border-primary-600 mt-2 pt-4 2xl:pt-8">
          <div className="flex items-center text-lg 2xl:text-2xl px-6 2xl:px-10 pb-2 2xl:pb-0 pt-2 justify-between">
            <span className="flex items-center">
              <BookOpenTextIcon
                className="inline-flex mr-3"
                size={20}
                strokeWidth={1.6}
              />
              <h2>Jippy Examples</h2>
            </span>
            <LikeButtons
              className="mt-0"
              onDislike={() =>
                likeMutation.mutate({
                  point_id: point.id,
                  type: -1,
                })
              }
              onLike={() =>
                likeMutation.mutate({
                  point_id: point.id,
                  type: 1,
                })
              }
              userLikeValue={userLikeValue}
            />
          </div>

          {pointHasExamples ? (
            <Accordion className="" type="multiple">
              {/* TODO: get confidence score, sort and bucket */}
              {point.type === "ANALYSIS" &&
                (point as PointDTO).point_analysises.map(
                  (point_analysis, index) => {
                    const { analysis, elaboration } = point_analysis;
                    const { id: analysisId, event } = analysis;
                    return (
                      <ExampleAccordion
                        article_id={
                          point_analysis.analysis.event.original_article.id
                        }
                        description={event.original_article.summary}
                        elaboration={elaboration}
                        id={`analysis-${analysisId}`}
                        index={index}
                        key={`analysis-${analysisId}`}
                        title={event.original_article.title}
                      />
                    );
                  },
                )}
              {point.type === "CONCEPT" &&
                (point as CPointDTO).point_article_concepts.map(
                  (point_article_concept, index) => {
                    return (
                      <ExampleAccordion
                        article_id={
                          point_article_concept.article_concept.article.id
                        }
                        description={
                          point_article_concept.article_concept.article.summary
                        }
                        elaboration={point_article_concept.elaboration}
                        id={`article_concept-${point_article_concept.article_concept.article.id}-${point_article_concept.article_concept.concept.id}`}
                        index={index}
                        key={`article_concept-${point_article_concept.article_concept.article.id}-${point_article_concept.article_concept.concept.id}`}
                        title={
                          point_article_concept.article_concept.article.title
                        }
                      />
                    );
                  },
                )}
              <div className="flex justify-between items-center bg-violet-100 shadow-inner py-2 px-8">
                <p className="font-medium">
                  Not satisfied with these examples?
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={regenerateExamples} variant="ghost">
                    Regenerate more examples{" "}
                    <LucideRefreshCw className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Accordion>
          ) : (
            <Alert className="p-8 bg-accent-100/20 mt-2">
              <AlertTitle className="font-medium text-lg">
                Jippy couldn&apos;t find relevant examples but has some
                pointers!
              </AlertTitle>
              <AlertDescription className="flex flex-col gap-4 text-lg mt-6">
                <h1 className="">
                  {point.fallback?.general_argument ??
                    "No relevant analysis found"}
                </h1>
                <h1>
                  {point.fallback?.alt_approach ?? "No relevant analysis found"}
                </h1>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PointAccordion;
