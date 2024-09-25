"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { z } from "zod";

import { completePasswordResetAuthPasswordResetPut } from "@/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const resetPasswordCompleteFormSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password should be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const resetPasswordFormDefault = {
  password: "",
  confirmPassword: "",
};

type ResetPasswordRequestForm = z.infer<typeof resetPasswordCompleteFormSchema>;

export default function ResetPasswordCompleteForm({
  code,
  onComplete,
}: {
  code: string;
  onComplete: () => void;
}) {
  const [isError, setIsError] = useState<boolean>(false);

  const form = useForm<ResetPasswordRequestForm>({
    resolver: zodResolver(resetPasswordCompleteFormSchema),
    defaultValues: resetPasswordFormDefault,
  });

  const onSubmit: SubmitHandler<ResetPasswordRequestForm> = async (data) => {
    const response = await completePasswordResetAuthPasswordResetPut({
      body: {
        password: data.password,
        confirm_password: data.confirmPassword,
      },
      withCredentials: true,
      query: {
        code: code,
      },
    });

    if (response.error) {
      setIsError(true);
    } else {
      setIsError(false);
      onComplete();
    }
  };

  return (
    <>
      <Card className="flex flex-col border-0 md:border px-6 sm:px-12 sm:py-3 md:w-[32rem] md:max-w-lg">
        <CardHeader className="space-y-3">
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>Enter your new password!</CardDescription>
        </CardHeader>

        <CardContent>
          <Box className="space-y-6">
            {isError && (
              <Alert variant="destructive">
                <CircleAlert className="h-5 w-5" />
                <AlertDescription>
                  Your password needs to match.
                </AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form
                className="space-y-10"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="space-y-4">
                  <Box className="flex flex-col space-y-2.5">
                    <FormField
                      control={form.control}
                      name={"password"}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="!text-current">
                            New Password
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Box>
                </div>
                <div className="space-y-4">
                  <Box className="flex flex-col space-y-2.5">
                    <FormField
                      control={form.control}
                      name={"confirmPassword"}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="!text-current">
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Box>
                </div>
                <Button className="w-full" type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
