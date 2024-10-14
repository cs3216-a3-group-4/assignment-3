"use client";

import { Inclination } from "@/client";
import LikeButtons from "@/components/likes/like-buttons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getEssay } from "@/queries/essay";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeHelpIcon,
  BookOpenCheckIcon,
  LucideIcon,
  MessageSquareTextIcon,
  SmileIcon,
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
                  <h2>Jippy Feedback</h2>
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
                        <AccordionTrigger>
                          <span className="flex items-center">
                            {<CommentIcon className="mr-3" />}
                            {inclinationToDisplayMap[comment.inclination]}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-text-muted text-lg">
                          <div className="px-4">
                            {comment.content}
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
