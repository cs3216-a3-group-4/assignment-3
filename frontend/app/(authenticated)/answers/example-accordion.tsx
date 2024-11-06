import Link from "next/link";
import { FileSymlinkIcon, SparkleIcon, ZapIcon } from "lucide-react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

type OwnProps = {
  article_id: number;
  index: number; // zero indexed
  title: string;
  description: string;
  elaboration: string;
  id: string;
};

const ExampleAccordion: React.FC<OwnProps> = ({
  article_id,
  index,
  title,
  description,
  elaboration,
  id,
}) => {
  return (
    <AccordionItem className="py-2 2xl:py-4 px-6 2xl:px-10" value={id}>
      <AccordionTrigger
        chevronClassName="ml-4"
        className="text-start text-lg xl:text-xl 3xl:text-2xl text-primary-alt-800 font-medium"
      >
        {index + 1}. {title}
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-y-8 2xl:gap-y-12 text-lg 2xl:text-xl 3xl:text-2xl py-2 2xl:py-4">
        <div className="flex flex-col gap-y-4 text-text-muted/80">
          <div className="flex justify-between items-baseline">
            <span className="font-medium text-lg 2xl:text-xl text-text-muted/80">
              <ZapIcon className="inline-flex mr-3" size={20} />
              Article summary
            </span>
            <Link href={`/articles/${article_id}`}>
              <Button
                className="h-8 w-fit text-text-muted mt-2"
                size="sm"
                variant="outline"
              >
                <FileSymlinkIcon className="h-4 w-4 mr-2" />
                Read more
              </Button>
            </Link>
          </div>
          <blockquote className="border-l-2 pl-6 italic text-text-muted 2xl:text-2xl tracking-wide">
            {description}
          </blockquote>
        </div>

        <div className="flex flex-col gap-y-4 mb-4">
          <span className="font-medium text-lg 2xl:text-xl text-text-muted/80">
            <SparkleIcon className="inline-flex mr-3" size={20} />
            Possible argument
          </span>
          <p className="tracking-wide">{elaboration}</p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ExampleAccordion;
