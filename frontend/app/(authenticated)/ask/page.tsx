"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SparklesIcon, Wand2Icon, ZapIcon } from "lucide-react";
import { Readable } from "stream";

import {
  askGpQuestionUserQuestionsAskGpQuestionGet,
  createUserQuestionUserQuestionsPost,
} from "@/client";
import Chip from "@/components/display/chip";
import Link from "@/components/navigation/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import AskPage from "./ask-page";
import { otherMockedResp } from "./temp-mocked";

export const MAX_GP_QUESTION_LEN: number = 120; // max character count

const Page = () => {
  // Whether an active query is running
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let child: ReactNode;
  // loading => loading-page (hasSent *, isLoading true, errorMessage *)
  if (isLoading) child = <>Loading</>;

  // fallback to ask-page just in case
  // initial => ask-page (hasSent false, isLoading false, errorMessage false)
  // validation error => ask-page (hasSent false, isLoading false, errorMessage true)
  child = <AskPage setIsLoading={setIsLoading} />;

  return (
    <div className="flex flex-col bg-muted w-full h-full max-h-full px-4 md:px-8 xl:px-24 overflow-y-auto">
      {child}
    </div>
  );
};

export default Page;
