import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, Wand2Icon, ZapIcon } from "lucide-react";

import { createUserQuestionUserQuestionsPost } from "@/client";
import Chip from "@/components/display/chip";
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
import JippyIcon from "@/public/jippy-icon/jippy-icon-sm";

const MAX_GP_QUESTION_LEN: number = 120; // max character count

// TODO: fix this
const EXAMPLE_GP_QUESTIONS: string[] = [
  "Discuss the view that prisoners should lose all their rights",
  "Is news today reliable?",
  "How realistic is it for countries to implement a national minimum wage for all their workers?",
];

interface AskPageProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
}

const AskPage = ({ setIsLoading, isLoading }: AskPageProps) => {
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

      if (response.data) {
        // @ts-expect-error dont care, deadline in 2 hours
        if (response.data.is_valid === false) {
          // @ts-expect-error dont care, deadline in 2 hours
          setErrorMsg(response.data.error_message);
          setIsLoading(false);

          return;
        } else {
          // @ts-expect-error dont care, deadline in 2 hours
          router.push(`../answers/${response.data.id}`);
        }
      }
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
      <div className="flex flex-col bg-muted w-full h-full max-h-full px-4 md:px-8 xl:px-4 2xl:px-24">
        <div className="flex flex-col pb-4 mb-4 py-8 xl:py-16 w-full max-w-6xl md:mx-8 lg:mx-8 xl:mx-auto">
          <div className="flex flex-col pb-4 mb-4 sticky pt-8 top-0 bg-muted border-b-2">
            <h1 className="font-medium mb-2 text-text-muted">
              Ask Jippy a General Paper exam question
            </h1>
            {errorMsg && (
              <Alert className="my-2 bg-red-50" variant="destructive">
                <CircleAlert className="h-5 w-5" />
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}
            <div className="w-full flex items-center gap-x-4 gap-y-6 flex-col md:flex-row">
              <AutosizeTextarea
                className="text-lg px-4 py-4 resize-none"
                maxHeight={200}
                maxLength={MAX_GP_QUESTION_LEN}
                onChange={(event) => setQuestionInput(event.target.value)}
                placeholder={EXAMPLE_GP_QUESTIONS[0]}
                value={questionInput}
              />
              <Button
                className="w-full px-4 md:w-auto"
                onClick={handleAskQuestion}
                size="lg"
              >
                <Wand2Icon className="mr-3" />
                Ask
              </Button>
            </div>
            <div className="flex w-full">
              {/* padding applied here due to scroll bar */}
              <div className="flex w-auto max-w-full overflow-x-auto py-8 md:py-4 gap-x-6">
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
              </div>
            </div>
          </div>

          <div className="flex w-full h-fit pb-8">
            <div className="flex flex-col px-8 py-6 lg:py-8 w-full h-fit bg-background rounded-lg border border-border">
              <span className="flex text-2xl 2xl:text-4xl font-semibold text-primary-800 items-center mb-6">
                <ZapIcon className="inline-flex mr-3 fill-primary-800" />
                Supercharge your learning with Jippy
                <Chip className="ml-4" label="Beta" />
              </span>

              <div className="flex h-full flex-col">
                <div className="mb-8">
                  <p className="text-lg text-muted-foreground mb-6">
                    Try feeding Jippy a GP paper 1 question! Jippy has been
                    studying extra hard and can...
                  </p>
                  <div className="grid md:grid-cols-3 gap-x-10 gap-y-8">
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
                          Real events, from the real world. Jippy has been
                          reading a whole lot of newspaper articles!
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
                          Jippy will also explain how the example can be weaved
                          into strengthening your points.
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                  <Alert className="mt-6" variant="teal">
                    <AlertTitle>Jippy can make mistakes</AlertTitle>
                    <AlertDescription>
                      <p>
                        Jippy is smart, but Jippy isn&apos;t perfect and can
                        make mistakes. Remember to double check any important
                        details.
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
                        - feature, ss - how it works, why better than chatgpt -
                        faqs - personal data
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="upcoming-features">
                      <AccordionTrigger>Upcoming features</AccordionTrigger>
                      <AccordionContent></AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="help-feedback">
                      <AccordionTrigger>
                        Get help or give feedback
                      </AccordionTrigger>
                      <AccordionContent></AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>

              <div></div>
            </div>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="absolute w-full h-full bg-slate-600/80 z-10 bottom-0 right-0 flex justify-center items-center">
          <Card className="p-8 flex flex-col justify-center items-center gap-8">
            <h1 className="text-lg">
              Jippy is finding points and examples! Please wait...
            </h1>
            <JippyIcon classname="animate-bounce w-24 h-24 pt-4" />
          </Card>
        </div>
      )}
    </>
  );
};

export default AskPage;
