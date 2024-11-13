"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  Lock,
  NotebookPen,
  Plus,
  SquareLibrary,
  SquarePlus,
} from "lucide-react";
import { z } from "zod";

import ArticleCard from "@/app/(authenticated)/home/article-card";
import Link from "@/components/navigation/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  getDailyPractice,
  useCreateDailyPracticeAttempt,
} from "@/queries/daily-practice";
import { parseLongDateNoYear } from "@/utils/date";

const pointSchema = z.object({
  points: z
    .array(
      z
        .string()
        .min(10, "Point must be longer than 10 characters")
        .max(1000, "Point should be shorter than 1000 characters"),
    )
    .min(1, "At least one point is required")
    .max(8, "Maximum of 8 points allowed"),
});

type PointSchema = z.infer<typeof pointSchema>;

const DailyPracticePage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const id = parseInt(params.id);
  const { data: dailyPractice, isLoading } = useQuery(getDailyPractice(id));

  const form = useForm<PointSchema>({
    resolver: zodResolver(pointSchema),
    defaultValues: { points: [""] },
  });

  const { fields, append } = useFieldArray<PointSchema>({
    // @ts-expect-error whdujwehudfhu
    name: "points" as const,
    control: form.control,
  });

  // @ts-expect-error whdujwehudfhu
  const addPoint = () => append("");
  // const removePoint = (index: number) => remove(index);

  const createDailyPracticeAttemptMutation = useCreateDailyPracticeAttempt(id);

  const [isHidden, setIsHidden] = useState(true); // TODO: hidden if not attempted yet
  const [isForm, setIsForm] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!dailyPractice) {
    return <div>Not found</div>;
  }

  const onSubmit = form.handleSubmit((data) => {
    createDailyPracticeAttemptMutation.mutate(data, {
      onSuccess: (response) => console.log(response.data),
    });
  });

  return (
    <div className="flex w-full p-4 sm:p-8 bg-muted overflow-y-auto min-h-full text-text">
      <div className="flex flex-col py-6 lg:py-10 w-full h-fit md:mx-8 xl:mx-24 bg-background rounded-lg border border-border px-8 sm:px-12 md:px-16 xl:px-20">
        <div
          className="flex text-sm font-medium items-center -mx-2 p-2 hover:bg-gray-100 rounded-lg w-fit cursor-pointer"
          onClick={() => router.push("/daily-practices")}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          <span>Back to daily practices</span>
        </div>

        <div className="mt-4">
          <h2 className="text-2xl font-semibold">
            {dailyPractice.practice_title}
          </h2>
          <h3 className="text-text-muted">
            {parseLongDateNoYear(dailyPractice.date)}
          </h3>
        </div>

        <div className="mt-6">{dailyPractice.practice_intro}</div>

        <Separator className="my-6" />

        <div>
          <h1 className="text-xl font-medium mb-4">
            Part 1: Current Affairs News Article
          </h1>
          <Alert className="mb-6 bg-[#f6eecd] text-[#635312] border-none">
            <SquareLibrary className="h-4 w-4 stroke-[#635312]" />
            <AlertTitle>Read the following article</AlertTitle>
            <AlertDescription>
              Read the{" "}
              <Link href={dailyPractice.article.url} isExternal size="sm">
                original article
              </Link>
              , formulate your thoughts, jot them down, and review Jippy&apos;s
              analysis.
            </AlertDescription>
          </Alert>
          <div className="mx-4">
            <ArticleCard article={dailyPractice.article} />
          </div>
        </div>

        <Separator className="my-6" />

        <div>
          <div className="flex w-full justify-between items-center mb-4">
            <h1 className="text-xl font-medium">Part 2: Tiny Essay Practice</h1>
            <Button
              disabled={isHidden || isForm}
              onClick={() => setIsForm(true)}
            >
              <Plus className="mr-2 h-5 w-5" /> New attempt
            </Button>
          </div>
          <Alert className="mb-6 bg-[#ecf4f8] text-[#076c89] border-none">
            <NotebookPen className="h-4 w-4 stroke-[#076c89]" />
            <AlertTitle>Practise makes perfect</AlertTitle>
            <AlertDescription>
              Write a quick essay outline and get feedback from Jippy.
            </AlertDescription>
          </Alert>

          <div>
            {isHidden ? (
              <div className="bg-gray-100 text-gray-600 p-8 rounded">
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  <span>
                    The essay question will be revealed once the article has
                    been read.
                  </span>
                </div>
                <div className="flex justify-end">
                  <span
                    className="text-sm text-gray-500 hover:underline cursor-pointer"
                    onClick={() => setIsHidden(false)}
                  >
                    Reveal anyways
                  </span>
                </div>
              </div>
            ) : (
              <div className="mx-4">
                <h4 className="text-lg font-medium">
                  {dailyPractice.question}
                </h4>

                {isForm ? (
                  <div className="flex flex-col border mt-4 rounded-sm p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">New attempt</h3>
                      <div>
                        <Button onClick={addPoint} variant="outline">
                          <SquarePlus className="h-4 w-4 mr-2" /> New point
                        </Button>
                      </div>
                    </div>
                    <Separator className="w-full my-4" />

                    <Form {...form}>
                      <div className="flex flex-col px-4">
                        <form onSubmit={onSubmit}>
                          {fields.map((field, index) => (
                            <FormField
                              control={form.control}
                              key={field.id}
                              name={`points.${index}`}
                              render={({ field }) => (
                                <FormItem className="mt-2">
                                  <FormLabel>{`Point ${index + 1}`}</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={`Point ${index + 1}`}
                                      type="text"
                                      {...field}
                                      {...form.register(
                                        `points.${index}` as const,
                                      )}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Write your topic sentence here.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ))}
                          <Button className="mt-6 w-full" onClick={onSubmit}>
                            Submit
                          </Button>
                        </form>
                      </div>
                    </Form>
                  </div>
                ) : (
                  <div className="bg-gray-100 text-gray-600 p-8 rounded mt-4 text-center">
                    No attempts yet.{" "}
                    <span className="hover:underline cursor-pointer">
                      Create new attempt.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyPracticePage;
