"use client";

import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ArticleSVG from "@/public/features/articles";
import AskQuestionSVG from "@/public/features/ask-question";
import FeedbackSVG from "@/public/features/feedback";

import ActionBarItem from "./action-bar-item";

const ActionBar = () => {
  const router = useRouter();
  return (
    <Card className="hidden md:block bg-primary-100/80">
      <CardHeader>
        <CardTitle className="text-primary-800">Jump in with Jippy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-12 items-stretch">
          <ActionBarItem
            actionLabel="Explore"
            actionPath="/articles"
            description="Get the latest insights from today’s news— summarised and
                analysed for GP."
            title="Explore articles"
          >
            <ArticleSVG
              className="max-h[28vh] mt-6 md:max-h-[22vh] md:mt-4 lg:mt-6 hover:-translate-y-3 transition-all cursor-pointer"
              onClick={() => router.push("/articles")}
            />
          </ActionBarItem>

          <ActionBarItem
            actionLabel="Start"
            actionPath="/ask"
            description="Need ideas? Jippy can help you generate points and examples for your essay."
            title="Get help with your essay"
          >
            <AskQuestionSVG
              className="max-h[28vh] mt-6 md:max-h-[22vh] md:mt-4 lg:mt-6 hover:-translate-y-3 transition-all cursor-pointer"
              onClick={() => router.push("/ask")}
            />
          </ActionBarItem>

          <ActionBarItem
            actionLabel="Grade"
            actionPath="/essay-feedback"
            description="Get targeted essay feedback based on A-Level marking standards."
            title="Get essay feedback"
          >
            <FeedbackSVG
              className="max-h[28vh] mt-6 md:max-h-[22vh] md:mt-4 lg:mt-6 hover:-translate-y-3 transition-all cursor-pointer"
              onClick={() => router.push("/essay-feedback")}
            />
          </ActionBarItem>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionBar;
