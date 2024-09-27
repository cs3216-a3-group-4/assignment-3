"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { UserQuestionMiniDTO } from "@/client";
import ScrollToTopButton from "@/components/navigation/scroll-to-top-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getAnswers } from "@/queries/user-question";

function AllQuestions() {
  const { data, isLoading } = useQuery(getAnswers());

  return (
    <div className="relative w-full h-full">
      <div
        className="flex bg-muted w-full h-full max-h-full py-8 overflow-y-auto"
        id="home-page"
      >
        <div className="flex flex-col py-6 lg:py-12 w-full h-fit mx-4 md:mx-8 xl:mx-24 bg-background rounded-lg border border-border px-8">
          {/* TODO: x-padding here is tied to the news article */}
          <div
            className="flex flex-col mb-4 gap-y-2 px-4 md:px-8 xl:px-12"
            id="homePage"
          >
            <div className="flex">
              <span className="text-4xl 2xl:text-4xl font-bold text-primary-800">
                Question history
              </span>
            </div>
          </div>

          <div className="flex flex-col w-full md:px-8 xl:px-12 mt-4">
            {isLoading ? (
              <div className="flex flex-col w-full">
                <LoadingSpinner className="w-24 h-24" />
              </div>
            ) : (
              data && (
                <div className="flex flex-col gap-2">
                  {data.map(
                    (userQuestion: UserQuestionMiniDTO, index: number) => (
                      <Link href={`/answers/${userQuestion.id}`} key={index}>
                        <Card className="p-4 flex gap-6">
                          <span className="text-slate-700">{index + 1} </span>{" "}
                          <span className="font-medium">
                            {userQuestion.question}
                          </span>
                        </Card>
                      </Link>
                    ),
                  )}
                </div>
              )
            )}
            {!isLoading && data!.length === 0 && (
              <Card className="mx-auto my-8 p-8 flex flex-col gap-8 max-w-lg">
                <h2 className="text-xl">
                  You don&apos;t have any past questions!
                </h2>
                <Link href="/ask">
                  <Button>Ask Jippy a GP question</Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </div>
      <ScrollToTopButton
        className="absolute right-4 bottom-4"
        minHeight={200}
        scrollElementId="home-page"
      />
    </div>
  );
}

export default AllQuestions;
