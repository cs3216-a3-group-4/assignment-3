import Link from "next/link";
import { AccordionContent } from "@radix-ui/react-accordion";
import { Wand2 } from "lucide-react";

import PricingTier from "@/components/billing/pricing-tier";
import { NAVBAR_HEIGHT } from "@/components/layout/app-layout";
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
import {
  JippyTierID,
  tierIDToTierDescription,
  tierIDToTierFeature,
  tierIDToTierName,
  TierPrice,
} from "@/types/billing";

const Landing = () => {
  return (
    <div className="relative w-full h-full overflow-y-auto">
      <div className="flex flex-col bg-muted w-full h-fit">
        <div
          // h-[calc(100vh_-_84px)] min-h-[calc(100vh_-_84px)] max-h-[calc(100vh_-_84px)]
          className={`flex flex-col w-full items-center justify-center px-12 md:px-0 py-8 gap-y-8 h-[calc(100vh_-_${NAVBAR_HEIGHT}px)] min-h-[calc(100vh_-_${NAVBAR_HEIGHT}px)] max-h-[calc(100vh_-_${NAVBAR_HEIGHT}px)]`}
        >
          <h1 className="flex max-w-xl text-center text-4xl sm:text-5xl md:text-7xl font-bold text-primary-800 animate-fade-up">
            Your GP Teacher isn’t the only one who croaks.
          </h1>
          <div>
            <h2 className="flex max-w-2xl text-center text-xl md:text-2xl text-text-muted/80 animate-jump-in animate-delay-600">
              Jippy is the first AI-powered tool to help you frog-leap your
              General Paper grades.
            </h2>
            <div className="flex flex-col md:flex-row w-full items-center justify-center gap-x-6 gap-y-3 mt-10">
              <Link href="/register">
                <Button size="lg">Join for free</Button>
              </Link>

              <Link href="#learn-more">
                <Button size="lg" variant="ghost">
                  Learn more
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col items-center justify-center bg-background w-full px-8 py-12 md:px-12 lg:py-24 lg:px-24"
          id="learn-more"
        >
          <h2 className="flex w-full text-center text-3xl md:text-5xl leading-tight text-primary justify-center font-bold max-w-[50rem] tracking-tight">
            Feeling overwhelmed with A-Level General Paper studies?
          </h2>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-medium mt-3 text-center">
            We&apos;ve been there. Learn how Jippy can help.
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8 max-w-7xl mt-8 lg:mt-16 md:mx-8">
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

        <div className="grid grid-cols-1 md:grid-cols-12 bg-background w-full px-8 py-12 md:px-12 lg:py-24 lg:px-24 gap-x-24">
          <div className="mb-6 md:col-span-5">
            <span className="text-2xl font-medium flex items-center">
              <Wand2 className="inline-flex mr-3 hover:animate-wiggle-more text-text-muted" />
              Learn how Jippy AI works
            </span>
            <h1 className="text-5xl tracking-tight leading-tight text-primary font-bold">
              Why you can trust Jippy
            </h1>
          </div>

          <div className="md:col-span-7 p-12 bg-background border rounded-lg shadow-lg">
            <p className="text-xl md:text-2xl text-text">
              Jippy is after all just an AI frog, and can make mistakes, but
              here are some things made sure to train Jippy on to avoid mistakes
              (or alert you to them) as much as possible:
            </p>
            <ul className="flex flex-col gap-y-4 mt-4 text-lg md:text-xl">
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

        <div className="flex flex-col items-center justify-center bg-background w-full py-16 md:py-24 px-8 md:px-24 place-items-start">
          <h1 className="text-5xl font-bold text-primary">Plans & pricing</h1>
          <h2 className="mb-16 text-2xl text-text-muted mt-4">
            We strive to keep Jippy accessible for everyone.
          </h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 bg-card gap-y-4">
            <PricingTier
              price={TierPrice.Free}
              tierDescription={tierIDToTierDescription[JippyTierID.Free]}
              tierFeatures={tierIDToTierFeature[JippyTierID.Free]}
              tierName={tierIDToTierName(JippyTierID.Free)}
            />
            <PricingTier
              price={TierPrice.Premium}
              tierDescription={tierIDToTierDescription[JippyTierID.Premium]}
              tierFeatures={tierIDToTierFeature[JippyTierID.Premium]}
              tierName={tierIDToTierName(JippyTierID.Premium)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-12 bg-background w-full py-16 md:py-24 px-8 md:px-24 gap-x-24">
          <div className="md:col-span-5">
            <h1 className="text-5xl tracking-tight leading-tight text-primary font-bold">
              Frequently asked questions
            </h1>
            <span className="text-2xl flex items-center mt-6">
              Still curious? Drop us an email at jippythefrog@gmail.com
            </span>
          </div>

          <div className="md:col-span-7 md:p-12 gap-y-8 mt-8 md:mt-0">
            <Accordion type="multiple">
              <AccordionItem
                className="border rounded-lg px-8 py-2 bg-background text-2xl font-medium text-text"
                value="q1"
              >
                <AccordionTrigger className="text-left">
                  Who is Jippy built for?
                </AccordionTrigger>
                <AccordionContent>
                  Students taking the Singapore GCE A-Level paper.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                className="border rounded-lg px-8 py-2 bg-background text-2xl font-medium text-text"
                value="q2"
              >
                <AccordionTrigger className="text-left">
                  Cannot just ChatGPT meh?
                </AccordionTrigger>
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
