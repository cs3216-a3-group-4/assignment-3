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
import { SparklesIcon, Wand2Icon, ZapIcon } from "lucide-react";

const MAX_GP_QUESTION_LEN: number = 120;
// TODO: fix this
const EXAMPLE_GP_QUESTIONS: string[] = [
  "Discuss the view that prisoners should lose all their rights",
  "Is news today reliable?",
  "How realistic is it for countries to implement a national minimum wage for all their workers?",
];

const Page = () => {
  return (
    <div className="flex flex-col bg-muted w-full h-full max-h-full px-4 md:px-8 xl:px-24 overflow-y-auto">
      <div className="flex flex-col pb-4 mb-4 sticky pt-8 top-0 bg-muted border-b-2">
        <h1 className="font-medium mb-2 text-text-muted">
          Ask Jippy a General Paper exam question
        </h1>
        <div className="w-full flex items-center gap-x-4">
          <AutosizeTextarea
            className="text-lg px-8 py-4 resize-none"
            placeholder={EXAMPLE_GP_QUESTIONS[0]}
            maxLength={MAX_GP_QUESTION_LEN}
            maxHeight={200}
          />
          <Button size="lg" className="px-4">
            <Wand2Icon className="mr-4" />
            Generate points
          </Button>
        </div>
        <div className="flex w-full">
          {/* padding applied here due to scroll bar */}
          <div className="flex w-auto max-w-full overflow-x-auto py-4 gap-x-6">
            {EXAMPLE_GP_QUESTIONS.map((question) => (
              <Chip
                key={question}
                label={question}
                size="lg"
                variant="primary"
                className="rounded-full px-4"
              />
            ))}
            <span className="w-max inline-block">
              <Link
                href="/questions/repository"
                opensInNewTab
                className="inline-block"
              >
                More{" "}
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
            <Chip label="Beta" className="ml-4" />
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
    </div>
  );
};

export default Page;
