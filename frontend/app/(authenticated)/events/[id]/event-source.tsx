import { NewspaperIcon } from "lucide-react";

import { BaseArticleDTO } from "@/client";
import Link from "@/components/navigation/link";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  articleSourceToDisplayNameMap,
  articleSourceToIconMap,
} from "@/types/events";
import { parseDate } from "@/utils/date";

interface EventSourceProps {
  originalSource: BaseArticleDTO;
}

// TODO: Ugly workaround, currently assumes one event only one source
const EventSource = ({ originalSource }: EventSourceProps) => {
  const SourceIcon = articleSourceToIconMap[originalSource.source];
  return (
    <div className="flex flex-col px-6 gap-y-8">
      <div className="flex flex-col gap-y-1">
        <span className="flex items-center font-medium text-3xl mb-6">
          <NewspaperIcon className="inline-flex mr-3 stroke-offblack fill-muted" />
          Event source
        </span>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
          <Card className="col-span-1" key={originalSource.title}>
            <div className="flex flex-col items-center h-fit p-6 gap-y-4">
              <SourceIcon />
              <div className="flex flex-col gap-y-4">
                <Link
                  className="font-medium no-underline hover:underline"
                  href={originalSource.url}
                  isExternal
                >
                  {originalSource.title}
                </Link>
                <div className="flex items-center text-muted-foreground gap-x-4">
                  <span>
                    {articleSourceToDisplayNameMap[originalSource.source]}
                  </span>
                  <Separator className="h-5" orientation="vertical" />
                  <span>{parseDate(originalSource.date)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventSource;
