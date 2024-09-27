import { Dispatch, SetStateAction, useState } from "react";
import router, { useRouter } from "next/navigation";
import { MessageCircleIcon, Wand2Icon, ZapIcon } from "lucide-react";

import { createUserQuestionUserQuestionsPost } from "@/client";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { MAX_GP_QUESTION_LEN } from "./page";

// TODO: fix this
const EXAMPLE_GP_QUESTIONS: string[] = [
  "Discuss the view that prisoners should lose all their rights",
  "Is news today reliable?",
  "How realistic is it for countries to implement a national minimum wage for all their workers?",
];

interface AskPageProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const AskPage = ({ setIsLoading }: AskPageProps) => {
  const router = useRouter();
  const [questionInput, setQuestionInput] = useState<string>("");
  // Whether there are any errors
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAskQuestion = async (): Promise<void> => {
    setIsLoading(true);

    // validate non-empty string
    const trimmed = questionInput.trim();
    const trimmedLength = trimmed.length;
    if (trimmedLength === 0) {
      setErrorMsg("Question should not be empty");
      setIsLoading(false);
      return;
    }

    // backend should validate this too
    if (trimmedLength > MAX_GP_QUESTION_LEN) {
      setErrorMsg(
        `Question should be less than ${MAX_GP_QUESTION_LEN} characters`,
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await createUserQuestionUserQuestionsPost({
        body: { question: questionInput },
      });
      if (response.error) {
        const errMsg = response.error.detail?.map((a) => a.msg).join("; ");
        throw new Error(errMsg ?? "Error fetching response");
      }
      setErrorMsg(null);
      router.push(`../answers/${response.data.id}`);
    } catch (e) {
      if (e instanceof Error) {
        setErrorMsg(e.message);
      }
      console.log("Error fetching response", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col pb-4 mb-4 sticky pt-8 top-0 bg-muted border-b-2">
        <h1 className="font-medium mb-2 text-text-muted">
          Ask Jippy a General Paper exam question
        </h1>
        <div className="w-full flex items-center gap-x-4">
          <AutosizeTextarea
            className="text-lg px-4 py-4 resize-none"
            maxHeight={200}
            maxLength={MAX_GP_QUESTION_LEN}
            onChange={(event) => setQuestionInput(event.target.value)}
            placeholder={EXAMPLE_GP_QUESTIONS[0]}
            value={questionInput}
          />
          <Button className="px-4" onClick={handleAskQuestion} size="lg">
            <Wand2Icon className="mr-3" />
            Ask
          </Button>
        </div>
        <div className="flex w-full">
          {/* padding applied here due to scroll bar */}
          <div className="flex w-auto max-w-full overflow-x-auto py-4 gap-x-6">
            {EXAMPLE_GP_QUESTIONS.map((question) => (
              <Chip
                className="rounded-full px-4 cursor-pointer"
                key={question}
                label={question}
                onClick={() => setQuestionInput(question)}
                size="lg"
                variant="primary"
              />
            ))}
            <span className="w-max inline-block">
              <Link
                className="inline-block"
                href="/questions/repository"
                opensInNewTab
              >
                More
                {/* TODO: change label and add functionality to open question repository */}
              </Link>
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-full h-fit pb-8">
        <div className="flex flex-col px-8 py-3 lg:py-8 w-full h-fit bg-background rounded-lg border border-border">
          <span className="flex text-2xl 2xl:text-4xl font-semibold text-primary-800 items-center mb-6">
            <ZapIcon className="inline-flex mr-3 fill-primary-800" />
            Supercharge your learning with Jippy
            <Chip className="ml-4" label="Beta" />
          </span>

          <div className="flex h-full flex-col">
            <div className="mb-8">
              <p className="text-lg text-muted-foreground mb-6">
                Try feeding Jippy a GP paper 1 question! Jippy has been studying
                extra hard and can...
              </p>
              <div className="grid grid-cols-3 gap-x-10 gap-y-8">
                <Card>
                  {/* TODO: add img */}
                  <CardHeader>
                    <CardTitle className="text-xl font-medium">
                      1. Brainstorm points
                    </CardTitle>
                    <CardDescription>
                      Jippy can help you think of supporting and opposing
                      arguments for your question.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  {/* TODO: add img */}
                  <CardHeader className="flex w-full">
                    <CardTitle className="text-xl font-medium">
                      2. Find relevant examples from current affairs
                    </CardTitle>
                    <CardDescription>
                      Real events, from the real world. Jippy has been reading a
                      whole lot of newspaper articles!
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  {/* TODO: add img */}
                  <CardHeader className="flex w-full">
                    <CardTitle className="text-xl font-medium">
                      3. And tying them together with contextual analysis
                    </CardTitle>
                    <CardDescription>
                      Jippy will also explain how the example can be weaved into
                      strengthening your points.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
              <Alert className="mt-6" variant="teal">
                <AlertTitle>Jippy can make mistakes</AlertTitle>
                <AlertDescription>
                  <p>
                    Jippy is smart, but Jippy isn't perfect and can make
                    mistakes. Remember to double check any important details.
                  </p>
                  {/* TODO: */}
                  {/* <p>
                // fallback, checks we do (link to article, grounded by
                example, confidence score)
              </p> */}
                </AlertDescription>
              </Alert>
            </div>

            <div className="flex flex-col w-full h-full">
              <Accordion type="multiple">
                <AccordionItem value="Learn more">
                  <AccordionTrigger>Learn more</AccordionTrigger>
                  <AccordionContent>
                    - feature, ss - how it works, why better than chatgpt - faqs
                    - personal data
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="upcoming-features">
                  <AccordionTrigger>Upcoming features</AccordionTrigger>
                  <AccordionContent></AccordionContent>
                </AccordionItem>

                <AccordionItem value="help-feedback">
                  <AccordionTrigger>Get help or give feedback</AccordionTrigger>
                  <AccordionContent></AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <div></div>
        </div>
      </div>
    </>
  );
};

export default AskPage;
