import { ZapIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
  summary: string;
}
const ArticleSummary = ({ summary }: Props) => {
  return (
    <div className="px-6">
      <Alert variant="teal">
        <div className="flex items-center mb-2">
          <ZapIcon className="stroke-teal-700 fill-teal-700 mr-3" size={20} />
          <AlertTitle className="text-teal-700 text-lg mb-0">
            AI-generated summary
          </AlertTitle>
        </div>
        <AlertDescription className="text-lg font-[450]">
          {summary}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ArticleSummary;
