import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaqAnswerDetails } from "@/types/landing";

const FaqAnswer = ({ id, title, description }: FaqAnswerDetails) => {
  return (
    <AccordionItem
      className="border rounded-lg px-8 py-2 bg-background text-text"
      value={`q${id}`}
    >
      <AccordionTrigger className="text-left">
        <h3 className="text-base lg:text-lg font-medium mr-2">{title}</h3>
      </AccordionTrigger>
      <AccordionContent className="text-gray-600 text-sm lg:text-base">
        {description}
      </AccordionContent>
    </AccordionItem>
  );
};

export default FaqAnswer;
