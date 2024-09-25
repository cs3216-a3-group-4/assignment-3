import { NewspaperIcon } from "lucide-react";

import { ArticleSource } from "@/client";
import Link from "@/components/navigation/link";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  articleSourceToDisplayNameMap,
  articleSourceToIconMap,
} from "@/types/events";

const EventSource = () => {
  const originalArticles: {
    name: string;
    source: ArticleSource;
    date: string;
    articleUrl: string;
  }[] = [
    {
      name: "Norris pips Verstappen to dramatic Singapore Grand Prix pole after Sainz crash",
      source: "CNA",
      date: "21 Sep 2024",
      articleUrl:
        "https://www.channelnewsasia.com/sport/singapore-grand-prix-gp-formula-1-qualifying-lando-norris-pole-4623041",
    },
    {
      name: "Lando Norris wins F1 Singapore Grand Prix despite hitting wall twice – as it happened",
      source: "GUARDIAN",
      date: "22 Sep 2024",
      articleUrl:
        "https://www.theguardian.com/sport/live/2024/sep/22/singapore-grand-prix-formula-one-live?filterKeyEvents=false&page=with%3Ablock-66f022af8f0801142f2830e7",
    },
  ];

  return (
    <div className="flex flex-col px-6 gap-y-8">
      <div className="flex flex-col gap-y-1">
        <span className="flex items-center font-medium text-3xl mb-6">
          <NewspaperIcon className="inline-flex mr-3 stroke-offblack fill-muted" />
          Event source
        </span>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
          {originalArticles.map((article) => {
            const articleSource = article.source;
            const sourceName = articleSourceToDisplayNameMap[articleSource];
            const SourceIcon = articleSourceToIconMap[articleSource];
            return (
              <Card className="col-span-1" key={article.name}>
                <div className="flex flex-col items-center h-fit p-6 gap-y-4">
                  <SourceIcon />
                  <div className="flex flex-col gap-y-4">
                    <Link
                      className="font-medium no-underline hover:underline"
                      href={article.articleUrl}
                      isExternal
                    >
                      {article.name}
                    </Link>
                    <div className="flex items-center text-muted-foreground gap-x-4">
                      <span>{sourceName}</span>
                      <Separator className="h-5" orientation="vertical" />
                      <span>{article.date}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventSource;
