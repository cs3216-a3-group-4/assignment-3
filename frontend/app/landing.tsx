import { AccordionContent } from "@radix-ui/react-accordion";
import { Wand2 } from "lucide-react";

import Chip from "@/components/display/chip";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Landing = () => {
  // TODO: build landing page
  return (
    <div className="relative w-full h-full overflow-y-auto">
      <div className="flex flex-col bg-muted w-full h-fit">
        <div className="flex flex-col w-full items-center justify-center py-8 gap-y-8 h-[calc(100vh_-_84px)] min-h-[calc(100vh_-_84px)] max-h-[calc(100vh_-_84px)]">
          <h1 className="flex max-w-xl text-center text-7xl font-bold text-primary-800 animate-fade-up">
            Your GP Teacher isn’t the only one who croaks.
          </h1>
          <div>
            <h2 className="flex max-w-2xl text-center text-2xl text-text-muted/80 animate-jump-in animate-delay-600">
              Jippy is the first AI-powered tool to help you frog-leap your
              General Paper grades.
            </h2>
            <div className="flex w-full items-center justify-center space-x-6 mt-10">
              <Button size="lg">Join for free</Button>
              <Button size="lg" variant="ghost">
                Learn more
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-background w-full py-24 px-24">
          <h2 className="flex w-full text-center text-5xl leading-tight text-primary justify-center font-bold max-w-[50rem] tracking-tight">
            Feeling overwhelmed with A-Level General Paper studies?
          </h2>
          <h3 className="text-3xl font-medium mt-3">
            We&apos;ve been there. Learn how Jippy can help.
          </h3>
          <div className="grid grid-cols-3 gap-x-10 max-w-7xl mt-16 mx-8">
            <Card className="drop-shadow-sm shadow-background-50 px-4 py-3">
              <CardHeader>
                <CardTitle className="text-primary-800 text-3xl">
                  Saves you time
                </CardTitle>
                <CardDescription className="text-xl text-text-muted pt-3">
                  No more combing through the web for hours to find examples.
                  Jippy sifts through the mountain of news articles to bring the
                  most interesting events going on around the world right to
                  you.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="drop-shadow-sm shadow-background-50 px-4 py-3">
              <CardHeader>
                <CardTitle className="text-primary-800 text-3xl">
                  Helps you build your example bank
                </CardTitle>
                <CardDescription className="text-xl text-text-muted pt-3">
                  Keeping up to date with current affairs is important for
                  scoring well in GP. Jippy is here to encourage everyone to
                  read the news by making it accessible.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="drop-shadow-sm shadow-background-50 px-4 py-3">
              <CardHeader>
                <CardTitle className="text-primary-800 text-3xl">
                  Insights and analysis
                </CardTitle>
                <CardDescription className="text-xl text-text-muted pt-3">
                  Ever tried reading the news and forget it immediately? Or
                  wonder how to even apply the knowledge to your GP essays? Not
                  anymore. Jippy can intelligently extract relevant GP analysis
                  and even generate essay points.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-12 bg-background w-full py-24 px-24 gap-x-24">
          <div className="col-span-5">
            <span className="text-2xl font-medium flex items-center">
              <Wand2 className="inline-flex mr-3 hover:animate-wiggle-more text-text-muted" />
              Learn how Jippy AI works
            </span>
            <h1 className="text-5xl tracking-tight leading-tight text-primary font-bold">
              Why you can trust Jippy
            </h1>
          </div>

          <div className="col-span-7 p-12 bg-background border rounded-lg shadow-lg">
            <p className="text-2xl text-text">
              Jippy is after all just an AI frog, and can make mistakes, but
              here are some things made sure to train Jippy on to avoid mistakes
              (or alert you to them) as much as possible:
            </p>
            <ul className="flex flex-col gap-y-4 mt-4 text-xl">
              <li>
                Jippy will alert you when Jippy is unsure of something and
                provide fall-backs instead during essay generation.
              </li>
              <li>
                Jippy is trained on a set real current affair news data set. We
                currently have 13k articles in our dataset.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-background w-full py-24 px-24">
          <h1 className="text-5xl font-bold text-primary">Plans & pricing</h1>
          <h2 className="mb-16 text-2xl text-text-muted mt-4">
            We strive to keep Jippy accessible for everyone.
          </h2>
          <div className="w-full grid grid-cols-2 gap-x-8 bg-card">
            <div className="rounded-lg p-16 flex flex-col items-center justify-center border shadow-muted-foreground/30 shadow-2xl bg-card">
              <h1 className="text-4xl font-semibold">Free</h1>
              <h1 className="text-2xl mt-4">$0.00 / month</h1>
              <div className="text-lg mt-8 flex flex-col space-y-6 w-full">
                <div className="flex flex-row">
                  See all events and summaries
                </div>
                <div className="flex flex-row">
                  Up to 10 event analyses per week
                </div>
                <div className="flex flex-row">
                  1 GP essay content generation per week, backed with updated
                  news and analyses
                </div>
              </div>
            </div>

            <div className="rounded-lg p-16 flex flex-col items-center justify-center shadow-muted-foreground/30 shadow-2xl bg-card">
              <h1 className="text-3xl font-medium">Premium</h1>
              <h1 className="text-2xl mt-4 line-through text-text-muted/70">
                $3.49 / month
              </h1>
              <div className="flex flex-col max-w-full justify-center">
                <span className="text-2xl mt-4">$1.99 / month</span>
                <Chip
                  className="mt-3"
                  label="Early bird discount"
                  size="lg"
                  variant="accent"
                />
              </div>

              <div className="text-lg mt-8 flex flex-col space-y-6 w-full">
                <div className="flex flex-row">
                  See all events and summaries
                </div>
                <div className="flex flex-row">
                  Unlimited event analyses per week
                </div>
                <div className="flex flex-row">
                  1 GP essay content generation per week, backed with updated
                  news and analyses
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 bg-background w-full py-24 px-24 gap-x-24">
          <div className="col-span-5">
            <h1 className="text-5xl tracking-tight leading-tight text-primary font-bold">
              Frequently asked questions
            </h1>
            <span className="text-2xl flex items-center mt-6">
              Still curious? Drop us an email at jippythefrog@gmail.com
            </span>
          </div>

          <div className="col-span-7 p-12 gap-y-8">
            <Accordion type="multiple">
              <AccordionItem
                className="border rounded-lg px-8 py-2 bg-background text-2xl font-medium text-text"
                value="q1"
              >
                <AccordionTrigger>Who is Jippy built for?</AccordionTrigger>
                <AccordionContent>
                  Students taking the Singapore GCE A-Level paper.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                className="border rounded-lg px-8 py-2 bg-background text-2xl font-medium text-text"
                value="q2"
              >
                <AccordionTrigger>Cannot just ChatGPT meh?</AccordionTrigger>
                <AccordionContent>
                  Jippy is trained on 13k datasets, and built specially for A
                  Level GP students.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="flex flex-col text-primary-foreground bg-primary w-full items-center py-16">
          <h1 className="text-lg w-fit">
            Built with 💚 (and stress and adrenaline)
          </h1>
          <h1 className=" w-fit text-sm">
            © 2024 Jippy. All rights reserved.
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Landing;
