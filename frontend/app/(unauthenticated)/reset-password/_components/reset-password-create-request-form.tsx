"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { z } from "zod";

import { requestPasswordResetAuthPasswordResetPost } from "@/client";
import TextField from "@/components/form/fields/text-field";
import Link from "@/components/navigation/link";
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
import { Form } from "@/components/ui/form";

import ResetPasswordRequestSent from "./reset-password-request-sent";

const resetPasswordRequestFormSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordFormDefault = {
  email: "",
  password: "",
};

type ResetPasswordRequestForm = z.infer<typeof resetPasswordRequestFormSchema>;

export default function ResetPasswordCreateRequestForm() {
  const [isError, setIsError] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);

  const form = useForm<ResetPasswordRequestForm>({
    resolver: zodResolver(resetPasswordRequestFormSchema),
    defaultValues: resetPasswordFormDefault,
  });

  const onSubmit: SubmitHandler<ResetPasswordRequestForm> = async (data) => {
    const response = await requestPasswordResetAuthPasswordResetPost({
      body: { email: data.email },
      withCredentials: true,
    });

    if (response.error) {
      setIsError(true);
    } else {
      setIsError(false);
      setSent(true);
    }
  };

  return sent ? (
    <ResetPasswordRequestSent
      email={form.getValues().email}
      reset={() => setSent(false)}
    />
  ) : (
    <>
      <Card className="flex flex-col border-0 md:border px-6 sm:px-12 sm:py-3 md:max-w-lg">
        <CardHeader className="space-y-3">
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Don&apos;t worry, enter the email associated with your Jippy account
            and we will send you a link to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Box className="space-y-6">
            {isError && (
              <Alert variant="destructive">
                <CircleAlert className="h-5 w-5" />
                <AlertDescription>
                  Your email or password is incorrect. Please try again, or{" "}
                  <Link href="/user/password-reset" size="sm">
                    reset your password
                  </Link>
                  .
                </AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form
                className="space-y-10"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="space-y-4">
                  <TextField label="Email" name="email" />
                </div>
                <Button className="w-full" type="submit">
                  Continue
                </Button>
              </form>
            </Form>
          </Box>
        </CardContent>
      </Card>
      <div className="flex gap-x-2 w-full justify-center items-baseline">
        <p className="text-sm text-muted-foreground">Not registered yet?</p>
        <Link href="/register" size="sm">
          Create an account
        </Link>
      </div>
    </>
  );
}
