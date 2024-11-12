import Link from "next/link";
import {
  BlocksIcon,
  BookOpenCheckIcon,
  NewspaperIcon,
  Wand2,
} from "lucide-react";

import { MiniArticleDTO } from "@/client";
import PricingTier from "@/components/billing/pricing-tier";
import FaqAnswer from "@/components/landing/faq-answer";
import FeatureList from "@/components/landing/feature-list";
import SampleFeedback from "@/components/landing/sample-feedback";
import SamplePoints from "@/components/landing/sample-points";
import { NAVBAR_HEIGHT } from "@/components/layout/app-layout";
import NewsArticle from "@/components/news/news-article";
import { Accordion } from "@/components/ui/accordion";
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
import Highlight from "@/components/ui/highlight";
import {
  JippyTierID,
  tierIDToTierDescription,
  tierIDToTierFeature,
  tierIDToTierName,
  TierPrice,
} from "@/types/billing";
import { Category } from "@/types/categories";
import { SampleComment, SamplePoint } from "@/types/landing";

const faqAnswers = [
  {
    title: "Who is Jippy built for?",
    description: "Students taking the Singapore GCE A-Level General Paper.",
  },
  {
    title: "Cannot just ChatGPT meh?",
    description:
      "Jippy is trained on a dataset with 18k articles and built specially for A Level GP students.",
  },
  {
    title:
      "What’s the difference between Jippy’s essay point generation and just searching for examples online?",
    description:
      "Jippy’s essay point generation goes beyond providing examples. It offers structured arguments and relevant current affairs linked to each point, saving you time on research and helping you build well-rounded, evidence-backed essays. It’s like having a GP tutor guiding you on how to frame your answers effectively.",
  },
  {
    title: "Can Jippy replace the need for a GP tutor?",
    description:
      "While Jippy provides invaluable support for GP revision, it is designed to complement your learning, not replace a tutor entirely. Jippy can be a great asset by giving feedback, curating examples, and offering guidance on essay structure, but human feedback and interaction can still be beneficial for deeper learning.",
  },
  {
    title: "Is my data safe with Jippy?",
    description:
      "Yes, we take user privacy and data protection very seriously. Jippy only collects essential information, such as your email and selected GP topics, to personalize your experience. We comply with data protection regulations to ensure your information is secure.",
  },
  {
    title: "Can I use Jippy for other subjects besides GP?",
    description:
      "Jippy is specifically designed for A-Level General Paper, focusing on essay writing and current affairs analysis that are unique to GP. While some features may be useful for other subjects, the content and tools are tailored to meet GP requirements.",
  },
  {
    title: "Is Jippy suitable for students outside Singapore?",
    description:
      "Jippy is designed with the Singapore A-Level GP syllabus in mind, so it is especially useful for students preparing for that exam. However, some features like essay feedback and current affairs analysis may still be valuable to other students looking to improve their critical thinking and writing skills.",
  },
];

const whyJippyReasons = [
  {
    reason: "Saves time",
    description:
      "Learn current affairs faster with summarised event details. Get feedback for your GP essay within a minute.",
  },
  {
    reason: "Powered by AI",
    description:
      "Generate suggested topic sentences with relevant examples and analyses for your chosen GP question. Get comments on strengths and weaknesses for your GP essay anytime.",
  },
  {
    reason: "Latest GP syllabus",
    description:
      "Build the conceptual analysis skills required by the latest syllabus with Jippy's suggested conceptual analysis for each news event. Get comments for your essay based on the 2024 Band Descriptors used by SEAB.",
  },
];

const sampleArticle1: MiniArticleDTO = {
  id: 1,
  title:
    "Bitcoin surge triggers billions in losses for crypto short traders after Trump win",
  summary:
    "Following Donald Trump's election victory, there has been a significant surge in Bitcoin prices, leading to substantial losses for short sellers in the cryptocurrency market. Bitcoin reached record highs above $82,000, driven by speculation that a more favorable regulatory environment would emerge under Trump's leadership. Traders who shorted various cryptocurrency-related stocks, including MicroStrategy and Coinbase, faced billions in losses, with cumulative short-selling losses exceeding $6 billion this year. The optimistic outlook from investors, along with Trump's campaign promises to promote digital assets, has fueled increased demand for Bitcoin and related stocks.",
  url: "https://www.channelnewsasia.com/business/bitcoin-surge-triggers-billions-losses-crypto-short-traders-after-trump-win-4741331",
  source: "CNA",
  date: "2024-11-11T00:00:00Z",
  image_url:
    "https://onecms-res.cloudinary.com/image/upload/s--wkMuQv8t--/c_fill,g_auto,h_355,w_632/fl_relative,g_south_east,l_mediacorp:cna:watermark:2024-04:reuters_1,w_0.1/f_auto,q_auto/v1/one-cms/core/2024-11-11t142959z_1_lynxmpekaa0hi_rtroptp_3_fintech-crypto-column.jpg?itok=JTYqt_4U",
  categories: [
    {
      id: 11,
      name: Category.Economics,
    },
    {
      id: 3,
      name: Category.Politics,
    },
  ],
  bookmarks: [],
};

const sampleComments: SampleComment[] = [
  {
    inclination: "good",
    content:
      "The argument presented is clear and nuanced, as it acknowledges both the negative aspects of business influence on politics while also recognizing the necessity of some level of business involvement in governmental affairs. This balanced view is commendable.",
  },
  {
    inclination: "neutral",
    content:
      "While the introduction provides a solid overview, it could benefit from a slightly clearer distinction between agreeing with certain aspects and disagreeing with the overall statement. A more explicit articulation of this stance would enhance clarity.",
  },
];

const samplePoints: SamplePoint[] = [
  {
    positive: true,
    title:
      "The value of work can be assessed by the salary it commands because high salaries often reflect the demand and scarcity of skills required for certain jobs, indicating their economic value.",
  },
  {
    positive: false,
    title:
      "The value of work cannot be solely assessed by the salary it commands because many essential roles, such as caregiving or teaching, provide significant societal contributions that are not adequately reflected in their pay.",
  },
];

const jippyFeatures = [
  {
    title: "Curated News",
    description:
      "Browse news events for only your selected GP topics. Learn faster with summarised event details and suggested conceptual analyses.",
    icon: <NewspaperIcon />,
    featureRender: (
      <>
        <NewsArticle newsArticle={sampleArticle1} onClick={() => {}} />
      </>
    ),
  },
  {
    title: "AI Essay Feedback",
    description:
      "Identify your strengths and get suggestions to improve your submitted essay, getting you closer to the next essay grading Band.",
    icon: <BlocksIcon />,
    featureRender: (
      <>
        <SampleFeedback comments={sampleComments} />
      </>
    ),
  },
  {
    title: "AI Essay Helper",
    description:
      "Generate suggested essay points with relevant examples and argumentative analyses for any provided GP question.",
    icon: <BookOpenCheckIcon />,
    featureRender: (
      <>
        <SamplePoints
          points={samplePoints}
          question="How far do you agree that the value of work can be assessed by the salary it commands?"
        />
      </>
    ),
  },
];

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
            <h2 className="max-w-2xl text-center text-xl md:text-2xl text-text-muted/80 animate-jump-in animate-delay-600">
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
          <h2 className="w-full text-center text-3xl md:text-5xl leading-tight text-primary justify-center font-bold max-w-[50rem] tracking-tight">
            Feeling <Highlight>overwhelmed</Highlight> with A-Level General
            Paper studies?
          </h2>
          <h3 className="text-xl md:text-2xl lg:text-3xl text-text-muted mt-8 text-center mb-10">
            We&apos;ve been there. Learn how Jippy can help.
          </h3>
          <div className="flex justify-stretch w-full">
            <Carousel
              className="md:hidden max-w-[450px] mx-auto overflow-x-hidden"
              opts={{ align: "center", loop: true }}
            >
              <CarouselContent className="flex items-stretch min-w-0">
                {whyJippyReasons.map((whyJippyReason, index) => (
                  <CarouselItem
                    className="flex flex-col basis-full md:basis-7/12 min-w-0"
                    key={index}
                  >
                    <Card className="flex-1 m-1 drop-shadow-sm shadow-background-50 px-4 py-3">
                      <CardHeader>
                        <CardTitle className="text-primary-800 text-3xl">
                          {whyJippyReason.reason}
                        </CardTitle>
                        <CardDescription className="text-xl text-text-muted pt-3">
                          {whyJippyReason.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPagination />
            </Carousel>
            <div className="hidden md:grid md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] w-full h-fit items-stretch gap-x-5 gap-y-3">
              {whyJippyReasons.map((whyJippyReason, index) => (
                <Card
                  className="m-1 drop-shadow-sm shadow-background-50 px-4 py-3"
                  key={index}
                >
                  <CardHeader>
                    <CardTitle className="text-primary-800 text-3xl">
                      {whyJippyReason.reason}
                    </CardTitle>
                    <CardDescription className="text-xl text-text-muted pt-3">
                      {whyJippyReason.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-background w-full gap-y-8 px-8 py-12 md:px-12 lg:py-24 lg:px-24">
          <h2 className="w-full text-center text-3xl md:text-5xl leading-tight text-primary justify-center font-bold max-w-[50rem] tracking-tight">
            Built for <Highlight>all</Highlight> your GP essay needs
          </h2>
          <h3 className="text-xl md:text-2xl lg:text-3xl text-text-muted text-center w-9/12 mb-10">
            Whether you need to build your example bank for your next essay, get
            comments to improve your practice essay, or generate essay points
            for a new essay prompt you&apos;re stuck on, Jippy has what you need
            for your essay revision.
          </h3>
          <div className="flex flex-row flex-wrap w-full h-fit items-stretch justify-center">
            <FeatureList features={jippyFeatures} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row bg-background w-full px-8 py-12 md:px-12 lg:py-24 lg:px-24 md:gap-x-24">
          <div className="flex flex-col flex-1 gap-y-8 md:basis-5/12 w-full md:w-fit items-center md:items-start">
            <h1 className="text-5xl tracking-tight leading-tight text-primary font-bold text-center md:text-left">
              Why you can trust Jippy
            </h1>
            <span className="text-xl md:text-2xl lg:text-3xl flex items-center">
              <Wand2 className="inline-flex mr-3 hover:animate-wiggle-more text-text-muted" />
              Learn how Jippy AI works
            </span>
          </div>

          <div className="flex-1 md:basis-7/12 p-12 mt-10 md:mt-0 bg-background border rounded-lg shadow-lg">
            <p className="text-xl md:text-2xl lg:text-3xl text-text">
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
                We currently have 18k articles in our dataset.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-background w-full py-16 md:py-24 px-8 md:px-24 place-items-start">
          <h1 className="text-5xl font-bold text-primary">Plans & pricing</h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl text-text-muted mt-8">
            We strive to keep Jippy accessible for everyone.
          </h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 mt-10 lg:mt-16 gap-x-8 bg-card gap-y-3">
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

        <div className="flex flex-col items-center bg-background w-full py-16 md:py-24 px-8 md:px-24">
          <div className="flex flex-col items-center gap-y-8">
            <h1 className="text-center max-w-[50rem] text-5xl tracking-tight leading-tight text-primary font-bold">
              Frequently asked questions
            </h1>
            <div className="text-xl md:text-2xl lg:text-3xl text-center">
              <span>Still curious? Drop us an email at </span>
              <a
                className="hover:text-text/80"
                href="mailto:jippythefrog@gmail.com"
              >
                jippythefrog@gmail.com
              </a>
            </div>
          </div>

          <div className="flex flex-col w-full md:p-12 mt-10">
            <Accordion
              className="flex flex-col gap-y-3 items-stretch w-full max-w-2xl mx-auto"
              type="multiple"
            >
              {faqAnswers.map((faqAnswer, index) => (
                <FaqAnswer
                  description={faqAnswer.description}
                  id={index}
                  key={index}
                  title={faqAnswer.title}
                />
              ))}
            </Accordion>
          </div>
        </div>
        <div className="flex flex-col text-primary-foreground bg-primary w-full items-center py-8 lg:py-16">
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
