"use client";

import { Inclination } from "@/client";
import LikeButtons from "@/components/likes/like-buttons";
import Link from "@/components/navigation/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getEssay } from "@/queries/essay";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeHelpIcon,
  BookOpenCheckIcon,
  BookOpenTextIcon,
  FileSymlinkIcon,
  LucideIcon,
  MessageSquareTextIcon,
  SmileIcon,
  SparkleIcon,
  ZapIcon,
} from "lucide-react";

const inclinationToDisplayMap: Record<Inclination, string> = {
  good: "Good",
  neutral: "Comment",
  bad: "Possible improvement",
};

const inclinationToIconMap: Record<Inclination, LucideIcon> = {
  good: SmileIcon,
  neutral: MessageSquareTextIcon,
  bad: BadgeHelpIcon,
};

const inclinationToClassNameMap: Record<Inclination, string> = {
  good: "text-green-700",
  neutral: "text-blue-500",
  bad: "text-amber-600",
};

const inclinationToChipClassNameMap: Record<Inclination, string> = {
  good: "bg-green-200/40",
  neutral: "bg-blue-100/50",
  bad: "bg-amber-200/40",
};

const inclinationToTriggerClassNameMap: Record<Inclination, string> = {
  good: "decoration-green-700",
  neutral: "decoration-blue-500",
  bad: "decoration-amber-600",
};

const EssayFeedbackPage = ({ params }: { params: { id: string } }) => {
  const essayId = parseInt(params.id);
  const { data, isLoading } = useQuery(getEssay(essayId));

  if (isLoading) return <></>;

  if (!data) return <>Cannot find</>;

  return (
    <div className="flex flex-col bg-muted w-full h-full max-h-full py-8 overflow-y-auto px-4 md:px-12 xl:px-44 ">
      <h1 className="text-4xl font-semibold mt-4 mb-8 text-primary-800">
        {data.question}
      </h1>
      <div className="flex flex-col gap-y-12">
        {data.paragraphs.map((paragraph) => (
          <div className="text-lg">
            <div className="border border-primary rounded-t-lg w-fit px-4 py-1 bg-primary">
              <span className="font-semibold text-primary-foreground capitalize">
                {/* TODO: link */}
                paragraph.type
              </span>
            </div>
            <div className="w-full border border-primary rounded-b-lg rounded-tr-lg px-12 py-8 bg-card text-justify">
              <p className="text-xl leading-normal text-text">
                {paragraph.content}
              </p>
              <Separator className="my-6" />
              <div className="flex items-center text-lg 2xl:text-2xl px-6 2xl:px-10 pb-2 2xl:pb-0 pt-2 justify-between text-slate-600 mb-2">
                <span className="flex items-center">
                  <BookOpenCheckIcon
                    className="inline-flex mr-3"
                    size={22}
                    strokeWidth={1.6}
                  />
                  <h2 className="font-semibold">Jippy Feedback</h2>
                </span>
              </div>
              <div className="flex flex-col gap-y-6 px-6 2xl:px-10">
                <Accordion type="multiple">
                  {paragraph.comments.map((comment) => {
                    const CommentIcon =
                      inclinationToIconMap[comment.inclination];
                    return (
                      <AccordionItem
                        value={comment.id.toString()}
                        key={comment.id}
                      >
                        <AccordionTrigger
                          className={cn(
                            inclinationToTriggerClassNameMap[
                              comment.inclination
                            ],
                          )}
                        >
                          <span
                            className={cn(
                              "flex items-center",
                              inclinationToClassNameMap[comment.inclination],
                            )}
                          >
                            {<CommentIcon className="mr-3" />}
                            <span
                              className={cn(
                                "px-2 py-1 rounded-lg",
                                inclinationToChipClassNameMap[
                                  comment.inclination
                                ],
                              )}
                            >
                              {inclinationToDisplayMap[comment.inclination]}
                            </span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-text-muted text-lg">
                          <div className="px-4">
                            <p>{comment.content}</p>
                            {comment.lack_example &&
                              comment.comment_analysises && (
                                <Alert className="my-6 px-6 border-none p-0">
                                  <div className="flex items-center gap-x-3 text-text-muted">
                                    <BookOpenTextIcon />
                                    <AlertTitle className="leading-normal tracking-normal">
                                      Jippy's example suggestion
                                    </AlertTitle>
                                  </div>
                                  {/* TODO: currently only returns the top result- might change */}
                                  <AlertDescription>
                                    <Accordion type="multiple">
                                      {comment.comment_analysises.map(
                                        (analysis) => (
                                          <AccordionItem
                                            value={analysis.analysis.id.toString()}
                                            key={analysis.analysis.id}
                                            className="border-none"
                                          >
                                            {/* TODO: currently assuming analysis always has event */}
                                            <AccordionTrigger className="text-lg text-text-muted">
                                              {analysis.analysis.event.title}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-lg">
                                              <div className="flex justify-between items-baseline mb-4">
                                                <span className="font-medium text-lg 2xl:text-xl text-text-muted/80">
                                                  <ZapIcon
                                                    className="inline-flex mr-3"
                                                    size={20}
                                                  />
                                                  Event summary
                                                </span>
                                                <Link
                                                  href={`/events/${analysis.analysis.event_id}`}
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
                                              <blockquote className="border-l-2 pl-6 italic text-text-muted 2xl:text-2xl tracking-wide mb-8">
                                                {
                                                  analysis.analysis.event
                                                    .description
                                                }
                                              </blockquote>
                                              <div className="flex flex-col gap-y-4">
                                                <span className="font-medium text-lg 2xl:text-xl text-text-muted/80">
                                                  <SparkleIcon
                                                    className="inline-flex mr-3"
                                                    size={20}
                                                  />
                                                  Possible argument
                                                </span>
                                                <p className="tracking-wide">
                                                  {analysis.skill_issue}
                                                </p>
                                              </div>
                                            </AccordionContent>
                                          </AccordionItem>
                                        ),
                                      )}
                                    </Accordion>
                                  </AlertDescription>
                                </Alert>
                              )}
                            <LikeButtons
                              onDislike={() => {}}
                              onLike={() => {}}
                              userLikeValue={0}
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EssayFeedbackPage;
