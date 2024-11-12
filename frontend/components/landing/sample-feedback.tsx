import {
  BadgeHelpIcon,
  BookOpenCheckIcon,
  LucideIcon,
  MessageSquareTextIcon,
  SmileIcon,
} from "lucide-react";

import { Inclination } from "@/client";
import LikeButtons from "@/components/likes/like-buttons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { SampleComment } from "@/types/landing";

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

const SampleFeedback = ({ comments }: { comments: SampleComment[] }) => {
  return (
    <>
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
          {comments.map((comment, index) => {
            const CommentIcon = inclinationToIconMap[comment.inclination];
            return (
              <AccordionItem key={index} value={`comment-${index}`}>
                <AccordionTrigger
                  className={cn(
                    inclinationToTriggerClassNameMap[comment.inclination],
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
                        inclinationToChipClassNameMap[comment.inclination],
                      )}
                    >
                      {inclinationToDisplayMap[comment.inclination]}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-text-muted text-lg">
                  <div className="px-4">
                    <p>{comment.content}</p>
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
    </>
  );
};

export default SampleFeedback;
