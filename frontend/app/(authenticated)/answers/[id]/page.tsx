"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpenTextIcon,
  FileSymlinkIcon,
  SparkleIcon,
  ZapIcon,
} from "lucide-react";

import Chip from "@/components/display/chip";
import LikeButtons from "@/components/likes/like-buttons";
import ScrollToTopButton from "@/components/navigation/scroll-to-top-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLikePoint } from "@/queries/like";
import { getAnswer } from "@/queries/user-question";
import { useUserStore } from "@/store/user/user-store-provider";

const AnswerPage = ({ params }: { params: { id: string } }) => {
  const user = useUserStore((state) => state.user);
  const id = parseInt(params.id);
  const { data, isPending } = useQuery(getAnswer(id));
  const likeMutation = useLikePoint(id);

  if (isPending) {
    return (
      <div className="flex justify-center items-center w-full">
        <LoadingSpinner className="w-24 h-24" />
      </div>
    );
  }
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
              {data.answer.points.map((point) => {
                const likes = point.likes;
                const userLike = likes.filter(
                  (like) => like.user_id === user?.id,
                )[0];
                const userLikeValue = userLike ? userLike.type : 0;
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
                          className="flex mb-4 w-fit max-w-full 2xl:text-xl"
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

                        {pointHasAnalysis ? (
                          <Accordion className="" type="multiple">
                            {/* TODO: get confidence score, sort and bucket */}
                            {point.point_analysises.map(
                              (point_analysis, index) => {
                                const { analysis, elaboration } =
                                  point_analysis;
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
                                          <Link
                                            href={`/articles/${point_analysis.analysis.event.original_article.id}`}
                                          >
                                            <Button
                                              className="h-8 w-fit text-text-muted mt-2"
                                              size="sm"
                                              variant="outline"
                                            >
                                              <FileSymlinkIcon className="h-4 w-4 mr-2" />
                                              Read more
                                            </Button>
                                          </Link>
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
                          <Alert className="p-8 bg-accent-100/20 mt-2">
                            <AlertTitle className="font-medium text-lg">
                              Jippy couldn&apos;t find relevant examples but has
                              some pointers!
                            </AlertTitle>
                            <AlertDescription className="flex flex-col gap-4 text-lg mt-6">
                              <h1 className="">
                                {point.fallback?.general_argument ??
                                  "No relevant analysis found"}
                              </h1>
                              <h1>
                                {point.fallback?.alt_approach ??
                                  "No relevant analysis found"}
                              </h1>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
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
