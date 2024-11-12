import Chip from "@/components/display/chip";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SamplePoint } from "@/types/landing";

const SamplePoints = ({ points }: { points: SamplePoint[] }) => {
  return (
    <Accordion className="flex flex-col gap-y-4" type="multiple">
      {points.map((point, index) => (
        <AccordionItem
          className="border border-primary/15 rounded-lg px-8 py-2 2xl:px-12 2xl:py-6 bg-background"
          key={index}
          value={`point-${index}`}
        >
          <AccordionTrigger
            chevronClassName="h-6 w-6 stroke-[2.5] ml-4"
            className="text-lg lg:text-xl 2xl:text-2xl text-primary font-medium text-start hover:no-underline pt-4 pb-6"
          >
            <div className="flex flex-col">
              <div className="flex">
                <Chip
                  className="flex mb-4 w-fit max-w-full 2xl:text-xl"
                  label={point.positive ? "For" : "Against"}
                  size="lg"
                  variant={point.positive ? "secondary" : "accent"}
                />
              </div>
              <span className="inline-block text-primary-900 hover:text-primary-900/80">
                {point.title}
              </span>
            </div>
          </AccordionTrigger>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default SamplePoints;
