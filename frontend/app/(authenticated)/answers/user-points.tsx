import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { LucideRefreshCw, Pen, Plus } from "lucide-react";
import { z } from "zod";

import { CPointDTO } from "@/client";
import CheckboxField from "@/components/form/fields/checkbox-field";
import TextField from "@/components/form/fields/text-field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import JippyIcon from "@/public/jippy-icon/jippy-icon-sm";
import { getAnswer, useCreatePoint } from "@/queries/user-question";

import PointAccordion from "./point-accordion";

type OwnProps = {
  answer_id: number;
};

type invalidPointError = {
  detail: string;
};

const pointFormSchema = z.object({
  title: z.string().min(1, "Required"),
  positive: z.boolean(),
});

const pointFormDefault = {
  title: "",
  positive: true,
};

type PointForm = z.infer<typeof pointFormSchema>;

const UserPoints: React.FC<OwnProps> = ({ answer_id }) => {
  const { data, isPending } = useQuery(getAnswer(answer_id));

  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const form = useForm<PointForm>({
    resolver: zodResolver(pointFormSchema),
    defaultValues: pointFormDefault,
  });
  const createPointMutation = useCreatePoint(answer_id);

  if (!data || isPending) {
    return;
  }

  // must be concept points because we implemented this after implementing the shift to concepts
  const userPoints = data.answer.points.filter(
    (point) => !point.generated,
  ) as unknown as CPointDTO[];
  const hasUserPoints = userPoints.length > 0;

  const onSubmit: SubmitHandler<PointForm> = async (data) => {
    setIsLoading(true);
    createPointMutation.mutate(data, {
      onSuccess: (response) => {
        setIsLoading(false);
        if (!response.data || Object.keys(response.data).length === 0) {
          setShowForm(false);
          setValidationError(null);
        } else {
          console.log(response.data);
          const results = response.data as invalidPointError;
          setShowForm(true);
          setValidationError(results.detail);
        }
      },
    });
  };

  const generateNewPoint = async (supporting: boolean) => {
    setIsLoading(true);
    createPointMutation.mutate(
      {
        title: "",
        positive: supporting,
      },
      {
        onSuccess: () => {
          setIsLoading(false);
          if (createPointMutation.data?.status === HttpStatusCode.Ok) {
            setShowForm(false);
          }
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-y-4 mt-8">
      {isLoading && (
        <div className="absolute w-full h-full bg-slate-600/80 z-50 bottom-0 right-0 flex justify-center items-center">
          <Card className="p-8 flex flex-col justify-center items-center gap-8">
            <h1 className="text-lg">
              Jippy is finding examples for your new point! Please wait...
            </h1>
            <JippyIcon classname="animate-bounce w-24 h-24 pt-4" />
          </Card>
        </div>
      )}
      {!hasUserPoints && (
        <div className="flex flex-wrap justify-between items-center bg-violet-100 shadow-inner py-2 px-8">
          <p className="font-medium pt-2">Not satisfied with these points?</p>
          <div className="flex flex-wrap">
            <Button onClick={() => generateNewPoint(true)} variant="ghost">
              Generate supporting point{" "}
              <LucideRefreshCw className="h-4 w-4 ml-2" />
            </Button>
            <Button onClick={() => generateNewPoint(false)} variant="ghost">
              Generate opposing point{" "}
              <LucideRefreshCw className="h-4 w-4 ml-2" />
            </Button>
            <Button onClick={() => setShowForm(true)} variant="ghost">
              Write your own <Pen className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
      {hasUserPoints && (
        <div className="flex flex-wrap justify-between items-center">
          <h4 className="text-2xl font-semibold">Your custom points</h4>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => generateNewPoint(true)} variant="ghost">
              Generate supporting point
              <LucideRefreshCw className="h-4 w-4 ml-2" />
            </Button>
            <Button onClick={() => generateNewPoint(false)} variant="ghost">
              Generate opposing point{" "}
              <LucideRefreshCw className="h-4 w-4 ml-2" />
            </Button>
            <Button onClick={() => setShowForm(true)} size="sm" variant="ghost">
              New Point <Plus className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
      {userPoints.map((point) => (
        <PointAccordion answer_id={answer_id} key={point.id} point={point} />
      ))}
      {validationError && <div className="text-red-500">{validationError}</div>}
      {showForm && (
        <Form {...form}>
          <form className="p-6 border" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <TextField label="Topic sentence" name="title" />
              <CheckboxField
                label="Is this a supporting point?"
                name="positive"
              />

              <div className="flex justify-between">
                <Button
                  onClick={() => setShowForm(false)}
                  type="button"
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button type="submit">Add point</Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default UserPoints;
