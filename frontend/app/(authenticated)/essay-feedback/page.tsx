import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { BookOpenCheckIcon, SparklesIcon } from "lucide-react";

const EssayFeedbackPage = () => {
  return (
    <div
      className="flex flex-col bg-muted w-full h-full max-h-full py-8 overflow-y-auto px-4 md:px-8 xl:px-24 "
      id="home-page"
    >
      <div className="mt-4 mb-8">
        <span className="flex items-center text-primary-800">
          <BookOpenCheckIcon className="w-8 h-8 mr-4" />
          <h1 className="text-4xl font-semibold">Get essay feedback</h1>
        </span>
        <h2 className="text-lg mt-3 text-gray-700">
          Get feedback on your GP essay at the snap of your fingers. Rest
          assured, your essay is yours. Jippy will never use your essay for
          anything else than providing you feedback.
        </h2>
      </div>
      <div className="h-full">
        <div className="flex flex-col py-6 lg:py-12 w-full h-fit min-h-full bg-background rounded-lg border border-border px-28 justify-between">
          <div className="flex flex-col h-fit">
            <AutosizeTextarea
              placeholder="Type your GP essay question"
              className="bg-none border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-3xl font-semibold mb-2 text-primary-700"
            />
            <AutosizeTextarea
              placeholder="Type or paste your essay here"
              className="bg-none border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-lg overflow-hidden"
            />
          </div>
          <Button size="lg" className="mt-16">
            <SparklesIcon className="w-6 h-6 mr-3" />
            Get Jippy's feedback
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EssayFeedbackPage;
