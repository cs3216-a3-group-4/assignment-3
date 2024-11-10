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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPagination,
} from "@/components/ui/carousel";
import {
  JippyTierID,
  tierIDToTierDescription,
  tierIDToTierFeature,
  tierIDToTierName,
  TierPrice,
} from "@/types/billing";


const Landing = () => {


  return (
    <div className="relative w-full h-full overflow-y-auto scroll-smooth">
      <div className="flex flex-col bg-muted min-w-full h-fit">
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
          <div className="flex w-full">
            <Carousel className="w-full" opts={{ align: "center", loop: true }}>
              <CarouselContent className="flex items-stretch mt-8 lg:mt-16">
                <CarouselItem className="flex flex-col basis-full md:basis-7/12">
                  <Card className="flex-1 m-1 drop-shadow-sm shadow-background-50 px-4 py-3">
                    <CardHeader>
                      <CardTitle className="text-primary-800 text-3xl">
                        Saves time
                      </CardTitle>
                      <CardDescription className="text-xl text-text-muted pt-3">
                        Learn current affairs faster with summarised event details. Get feedback for your GP essay within a minute.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </CarouselItem>

                <CarouselItem className="flex flex-col basis-full md:basis-7/12">
                  <Card className="flex-1 m-1 drop-shadow-sm shadow-background-50 px-4 py-3">
                    <CardHeader>
                      <CardTitle className="text-primary-800 text-3xl">
                        Powered by AI
                      </CardTitle>
                      <CardDescription className="text-xl text-text-muted pt-3">
                        Generate suggested topic sentences with relevant examples and analyses for your chosen GP question. Get comments on strengths and weaknesses for your GP essay anytime.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </CarouselItem>

                <CarouselItem className="flex flex-col basis-full md:basis-7/12">
                  <Card className="flex-1 m-1 drop-shadow-sm shadow-background-50 px-4 py-3">
                    <CardHeader>
                      <CardTitle className="text-primary-800 text-3xl">
                        Latest GP syllabus
                      </CardTitle>
                      <CardDescription className="text-xl text-text-muted pt-3">
                        Build the conceptual analysis skills required by the latest syllabus with Jippy's suggested conceptual analysis for each news event. Get comments for your essay based on the 2024 Band Descriptors used by SEAB.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </CarouselItem>
              </CarouselContent>
              <CarouselPagination />
            </Carousel>
          </div>
        </div>

        <div className="flex flex-col md:flex-row bg-background w-full px-8 py-12 md:px-12 lg:py-24 lg:px-24 md:gap-x-24">
          <div className="flex-1 mb-6 md:basis-5/12">
            <span className="text-2xl font-medium flex items-center">
              <Wand2 className="inline-flex mr-3 hover:animate-wiggle-more text-text-muted" />
              Learn how Jippy AI works
            </span>
            <h1 className="text-5xl tracking-tight leading-tight text-primary font-bold">
              Why you can trust Jippy
            </h1>
          </div>

          <div className="flex-1 md:basis-7/12 p-12 bg-background border rounded-lg shadow-lg">
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
                Jippy is trained on a set of real current affairs news data set.
                We currently have 13k articles in our dataset.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-background w-full py-16 md:py-24 px-8 md:px-24 place-items-start">
          <h1 className="text-5xl font-bold text-primary">Plans & pricing</h1>
          <h2 className="text-2xl text-text-muted mt-4">
            We strive to keep Jippy accessible for everyone.
          </h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 mt-8 lg:mt-16 gap-x-8 bg-card gap-y-4">
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

        <div className="flex flex-col md:flex-row bg-background w-full py-16 md:py-24 px-8 md:px-24 md:gap-x-24">
          <div className="flex-1 md:basis-5/12">
            <h1 className="text-5xl tracking-tight leading-tight text-primary font-bold">
              Frequently asked questions
            </h1>
            <div className="text-2xl mt-4">
              <span>Still curious? Drop us an email at </span>
              <a
                className="hover:text-text/80"
                href="mailto:jippythefrog@gmail.com"
              >
                jippythefrog@gmail.com
              </a>
            </div>
          </div>

          <div className="flex-1 md:basis-7/12 md:p-12 gap-y-8 mt-8 md:mt-0">
            <Accordion className="flex flex-col gap-y-8" type="multiple">
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
                  Jippy is trained on a dataset with 13k articles and built
                  specially for A Level GP students.
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
