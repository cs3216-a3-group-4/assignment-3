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
import { useUserStore } from "@/store/user/user-store-provider";
import { getNextMonday, toQueryDateFriendly } from "@/utils/date";

const MAX_GP_QUESTION_LEN: number = 200; // max character count

// TODO: fix this
const EXAMPLE_GP_QUESTIONS: string[] = [
  "How far do you agree that the value of work can be assessed by the salary it commands?",
  "Longer life expectancy creates more problems than benefits. Discuss.",
  "Assess the view that attempts to control climate change can never be truly effective",
];

interface AskPageProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
}

const LimitAlert = ({ triesLeft, warningText, isRedAlert }: { triesLeft: number, warningText: string, isRedAlert: boolean }) => {
  return (
    <Alert
      className={`my-2 flex items-center space-x-2 ${isRedAlert ? "bg-red-50" : ""}`}
      variant={`${isRedAlert ? "destructive" : "teal"}`}
    >
      <div className="flex items-center">
        <CircleAlert className={`h-5 w-5 ${isRedAlert ? "" : "stroke-teal-700"}`} />
      </div>
      <AlertDescription className={`${isRedAlert ? "" : "text-teal-700"} font-medium`}>
        {warningText}
      </AlertDescription>
    </Alert>
  )
};

const AskPage = ({ setIsLoading, isLoading }: AskPageProps) => {
  const router = useRouter();
  const [questionInput, setQuestionInput] = useState<string>("");
  // Whether there are any errors
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const user = useUserStore((store) => store.user);
  const setLoggedIn = useUserStore((store) => store.setLoggedIn);

  if (!user) {
    // This should be impossible.
    return;
  }

  const triesLeft =
    user.tier.gp_question_limit - (user.usage?.gp_question_asked || 0);
  const hasTriesLeft = triesLeft !== 0;

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
        if ("is_valid" in response.data && response.data.is_valid === false) {
          setErrorMsg(response.data.error_message);
          setIsLoading(false);
          return;
        } else {
          if (!("id" in response.data)) {
            console.log("Answer ID is undefined", response.data);
            setErrorMsg("Uh-oh, this shouldn't be happening. Try again?");
            setIsLoading(false);
            return;
          }
          setLoggedIn({
            ...user,
            usage: {
              ...user.usage,
              gp_question_asked: (user.usage?.gp_question_asked || 0) + 1,
            },
          });
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
        <div className="flex flex-col py-4 mb-4 xl:py-10 2xl:py-16 w-full max-w-6xl md:mx-8 lg:mx-8 xl:mx-auto">
          <div className="flex flex-col pb-4 mb-4 sticky top-0 bg-muted border-b-2 z-40">
            <h1 className="font-medium mb-2 text-text-muted">
              Ask Jippy a General Paper exam question
            </h1>
            {hasTriesLeft ? (
              <LimitAlert
                triesLeft={triesLeft}
                warningText={`You have ${triesLeft} ${triesLeft === 1 ? "question" : "questions"} left. It will reset on ${toQueryDateFriendly(getNextMonday())} 12:00AM.`}
                isRedAlert={false} />
            ) : (
              <LimitAlert
                triesLeft={triesLeft}
                warningText={`You've reached the question limit. It will reset on ${toQueryDateFriendly(getNextMonday())} 12:00AM.`}
                isRedAlert={true} />
            )}

            {errorMsg && (
              <Alert
                className="my-2 bg-red-50 flex items-center space-x-2"
                variant="destructive"
              >
                <div className="flex items-center">
                  <CircleAlert className="h-5 w-5" />
                </div>
                <AlertDescription className="font-medium">
                  {errorMsg}
                </AlertDescription>
              </Alert>
            )}
            <div className="w-full flex items-center gap-x-4 gap-y-6 flex-col md:flex-row">
              <AutosizeTextarea
                className="md:text-lg px-4 py-4 resize-none"
                disabled={!hasTriesLeft}
                maxHeight={200}
                maxLength={MAX_GP_QUESTION_LEN}
                onChange={(event) => setQuestionInput(event.target.value)}
                placeholder={EXAMPLE_GP_QUESTIONS[0]}
                value={questionInput}
              />
              <Button
                className="w-full md:px-4 md:w-auto"
                disabled={!hasTriesLeft}
                onClick={handleAskQuestion}
                size="lg"
              >
                <Wand2Icon className="mr-3" />
                Ask
              </Button>
            </div>
            <div className="flex w-full max-w-full flex-wrap">
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
              <span className="mb-6 justify-items-start items-center md:flex">
                <span className="inline-block md:flex md:flex-row text-2xl 2xl:text-4xl font-semibold text-primary-800 align-middle items-center">
                  <ZapIcon className="inline-block mr-3 fill-primary-800" />
                  <span className="inline-block">
                    Supercharge your learning with Jippy
                  </span>
                </span>
                <span className="inline-block mt-2">
                  <Chip className="sm:ml-3" label="Beta" />
                </span>
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
                        <CardDescription className="text-base">
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
                        <CardDescription className="text-base">
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
                        <CardDescription className="text-base">
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
                    <AccordionItem value="learn-more">
                      <AccordionTrigger className="text-left">
                        Learn more
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-2">
                        <p>
                          Jippy has been studying CNA articles daily. It uses
                          generative AI to generate points for your essay
                          questions and supplements them with relevant articles.
                          Jippy is however, a newborn frog in the world events
                          and reasoning, so we would appreciate your support and
                          feedback!
                        </p>
                        <p>
                          Jippy will also keep your personal data safe and
                          doesn&apos;t send it to any third parties.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="help-feedback">
                      <AccordionTrigger className="text-left">
                        Get help or give feedback
                      </AccordionTrigger>
                      <AccordionContent>
                        Spot an issue? Send us an email at{" "}
                        <a
                          className="underline"
                          href="mailto:jippythefrog@gmail.com"
                        >
                          jippythefrog@gmail.com
                        </a>
                        .
                      </AccordionContent>
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
        <div className="absolute w-full h-full bg-slate-600/80 z-50 bottom-0 right-0 flex justify-center items-center">
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
