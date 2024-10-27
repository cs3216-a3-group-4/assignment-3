"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActionBarItem from "./action-bar-item";

import ArticleSVG from "@/public/features/articles";
import { useRouter } from "next/navigation";
import AskQuestionSVG from "@/public/features/ask-question";
import FeedbackSVG from "@/public/features/feedback";

const ActionBar = () => {
  const router = useRouter();
  return (
    <Card className="bg-primary-100/80">
      <CardHeader>
        <CardTitle className="text-primary-800">Jump in with Jippy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-3 gap-12 items-stretch">
          <ActionBarItem
            title="Explore articles"
            actionPath="/articles"
            actionLabel="Explore"
            description="Get the latest insights from today’s news— summarised and
                analysed for GP."
          >
            <ArticleSVG
              className="max-h-[24vh] mt-6 hover:-translate-y-3 transition-all cursor-pointer"
              onClick={() => router.push("/articles")}
            />
          </ActionBarItem>

          <ActionBarItem
            title="Ask an essay question"
            actionPath="/ask"
            actionLabel="Ask"
            description="Need ideas? Jippy can help you generates key points and examples for your essay."
          >
            <AskQuestionSVG
              className="max-h-[24vh] mt-6 hover:-translate-y-3 transition-all cursor-pointer"
              onClick={() => router.push("/ask")}
            />
          </ActionBarItem>

          <ActionBarItem
            title="Get essay feedback"
            actionPath="/essay-feedback"
            actionLabel="Start"
            description="Get targeted essay feedback based on A-Level marking standards."
          >
            <FeedbackSVG
              className="max-h-[24vh] mt-6 hover:-translate-y-3 transition-all cursor-pointer"
              onClick={() => router.push("/essay-feedback")}
            />
          </ActionBarItem>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionBar;
