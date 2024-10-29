import { Card, CardContent } from "@/components/ui/card";

import ActionBarItem from "./action-bar-item";

const ActionBarMobile = () => {
  return (
    <div className="grid grid-cols-2 gap-4 md:hidden">
      <Card className="bg-primary-100/80 col-span-2">
        <CardContent className="p-4">
          <ActionBarItem
            actionLabel="Explore"
            actionPath="/articles"
            description="Get GP insights from today’s top news."
            title="Explore articles"
          />
        </CardContent>
      </Card>

      <Card className="bg-primary-100/80 aspect-square">
        <CardContent className="p-4">
          <ActionBarItem
            actionLabel="Start"
            actionPath="/ask"
            description="Need ideas? Generate points and examples for your essay."
            title="Essay helper"
            twoLine
          />
        </CardContent>
      </Card>

      <Card className="bg-primary-100/80 aspect-square">
        <CardContent className="p-4">
          <ActionBarItem
            actionLabel="Grade"
            actionPath="/essay-feedback"
            description="Get targeted essay feedback based on A-Level marking standards."
            title="Essay feedback"
            twoLine
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionBarMobile;
