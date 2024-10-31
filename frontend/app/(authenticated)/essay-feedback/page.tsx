"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { HttpStatusCode } from "axios";
import {
  BookCheckIcon,
  BookOpenCheckIcon,
  CircleAlert,
  SparklesIcon,
} from "lucide-react";
import { z } from "zod";

import { createEssayEssaysPost, ParagraphType } from "@/client";
import Chip from "@/components/display/chip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import JippyIconSm from "@/public/jippy-icon/jippy-icon-sm";
import { useUserStore } from "@/store/user/user-store-provider";
import {
  JippyTierID,
  tierIDToTierName,
  UNVERIFIED_TIER_ID,
} from "@/types/billing";

interface Paragraph {
  content: string;
  type: ParagraphType;
}

const EssayFeedbackPage = () => {
  const router = useRouter();
  const user = useUserStore((store) => store.user);
  const [gpQuestion, setGpQuestion] = useState<string | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [essay, setEssay] = useState<string | undefined>(undefined);

  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const isUserUnverified =
    user?.verified === false || user?.tier_id === UNVERIFIED_TIER_ID;

  // TODO: finalise limits
  const formSchema = z.object({
    gpQuestion: z
      .string()
      .min(10, "GP question must be at least 10 characters")
      .max(200, "GP question must be at most 200 characters"),
    essay: z
      .string()
      .min(500, "Essay must be at least 500 characters")
      .max(20000, "Essay must be at most 20000 characters"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setGpQuestion(values.gpQuestion);
    setEssay(values.essay);

    const rawParagraphs = values.essay
      .split("\n")
      .map((paragraph) => paragraph.trim())
      .filter((paragraph) => paragraph.length > 0);

    const lastParagraphIndex = rawParagraphs.length - 1;
    const processedParagraphs = rawParagraphs.map(
      (paragraph, index): Paragraph => {
        // assume if only 1 paragraph, that paragraph is introduction
        if (index === 0) return { content: paragraph, type: "introduction" };
        if (index === lastParagraphIndex)
          return { content: paragraph, type: "conclusion" };
        return { content: paragraph, type: "paragraph" };
      },
    );

    setParagraphs(processedParagraphs);
    setIsReviewing(true);
  };

  const onCancelReview = () => {
    setIsReviewing(false);
    setParagraphs([]);
  };

  const onSubmitReview = async () => {
    setIsLoading(true);

    try {
      if (gpQuestion === undefined) throw new Error("");
      const response = await createEssayEssaysPost({
        body: { question: gpQuestion, paragraphs: paragraphs },
      });

      if (response.error) {
        if (response.status === HttpStatusCode.TooManyRequests) {
          if (user?.tier_id == UNVERIFIED_TIER_ID) {
            setErrorMessage(
              "Verify your email now to gain access to essay feedback.",
            );
          } else {
            setErrorMessage(
              `You have reached your ${tierIDToTierName(user?.tier_id || JippyTierID.Free)} Tier limit for generating essay feedback. Consider upgrading your Tier for more.`,
            );
          }
        } else {
          setErrorMessage(
            "Error while generating your essay feedback. Please try again.",
          );
        }
      } else {
        const essayId = response.data.essay_id;
        router.push(`/essay-feedback/${essayId}`);
      }
    } catch (error) {
      setErrorMessage(
        "Error while generating your essay feedback. Please try again.",
      );
      console.log("Error fetching response", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="absolute w-full h-full bg-slate-600/80 z-50 bottom-0 right-0 flex justify-center items-center">
        <Card className="p-8 flex flex-col justify-center items-center gap-8">
          <h1 className="text-lg">
            Jippy is studying your essay! Please wait...
          </h1>
          <JippyIconSm classname="animate-bounce w-24 h-24 pt-4" />
        </Card>
      </div>
    );
  }

  if (isReviewing) {
    return (
      <div className="flex flex-col bg-muted w-full h-full max-h-full py-8 overflow-y-auto px-4 md:px-8 xl:px-24 ">
        <div className="mt-4 mb-8">
          <span className="flex items-center text-primary-800">
            <BookCheckIcon className="w-8 h-8 mr-4" />
            <h1 className="text-4xl font-semibold">Review your submission</h1>
          </span>
          <h2 className="text-lg mt-3 text-gray-700">
            Before submitting, make sure your essay has been properly formatted,
            and that each paragraph is appropriately tagged. This helps Jippy
            give you accurate and meaningful feedback!
          </h2>
          {errorMessage && (
            <Alert
              className="flex flex-row items-center gap-x-2 mt-4"
              variant="destructive"
            >
              <div className="flex items-center flex-shrink-0">
                <CircleAlert className="h-5 w-5 stroke-red-500" />
              </div>
              <AlertDescription className="grow">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
        </div>
        <div className="flex flex-col gap-y-6">
          {paragraphs.map((paragraph, index) => (
            <div key={"paragraph-" + index}>
              <div className="border border-primary rounded-t-lg w-fit px-4 py-1 bg-primary">
                <span className="font-medium text-primary-foreground capitalize">
                  {paragraph.type}
                </span>
              </div>
              <div className="w-full max-w-full border border-primary rounded-b-lg rounded-tr-lg px-4 py-4 text-lg text-pretty break-words bg-card">
                {paragraph.content}
              </div>
            </div>
          ))}
        </div>
        <div className="flex w-full mt-8 gap-x-6">
          <Button
            className="w-full"
            onClick={onCancelReview}
            size="lg"
            variant="outline"
          >
            Cancel
          </Button>
          <Button className="w-full" onClick={onSubmitReview} size="lg">
            Looks good!
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col bg-muted w-full h-full max-h-full overflow-y-auto py-8 px-4 md:px-8 xl:px-24"
      id="home-page"
    >
      <div className="px-6 mt-4 mb-8">
        <span className="flex items-center text-primary-800">
          <BookOpenCheckIcon className="w-12 h-12 mr-6" />
          <h1 className="text-4xl font-semibold">Get essay feedback</h1>
          <Chip className="sm:ml-3" label="Beta" />
        </span>
        <h2 className="text-lg mt-3 text-gray-700">
          Get feedback on your GP essay at the snap of your fingers. Rest
          assured, your essay is yours. Jippy will never use your essay for
          anything else than providing you feedback.
        </h2>
      </div>
      {isUserUnverified && !errorMessage && (
        <div className="pb-4">
          <Alert
            className="flex flex-row items-center gap-x-2"
            variant="destructive"
          >
            <div className="flex items-center flex-shrink-0">
              <CircleAlert className="h-5 w-5 stroke-red-500" />
            </div>
            <AlertDescription className="grow">
              Verify your email to gain access to essay feedback.
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div className="grow flex flex-col">
        <Form {...form}>
          <form className="h-full" onSubmit={form.handleSubmit(onSubmit)}>
            <div
              className={`flex flex-col py-6 lg:py-12 w-full bg-background rounded-lg border px-4 md:px-8 xl:px-24 justify-between ${isUserUnverified ? "border-red-300" : ""}`}
            >
              <FormField
                control={form.control}
                name="gpQuestion"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormControl>
                      <AutosizeTextarea
                        className="bg-none border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-3xl font-semibold text-primary-700"
                        disabled={isUserUnverified}
                        placeholder="Type your GP essay question"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="essay"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormControl>
                      <AutosizeTextarea
                        className="bg-none border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-lg overflow-x-hidden"
                        disabled={isUserUnverified}
                        placeholder="Type or paste your essay here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              className="mt-4"
              disabled={isUserUnverified}
              size="lg"
              type="submit"
              variant={isUserUnverified ? "destructive_outline" : "default"}
            >
              <SparklesIcon className="w-6 h-6 mr-3" />
              Get Jippy&apos;s feedback
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EssayFeedbackPage;
