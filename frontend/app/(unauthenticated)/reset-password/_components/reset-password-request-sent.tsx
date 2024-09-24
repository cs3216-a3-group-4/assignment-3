"use client";

import { useState } from "react";

import { requestPasswordResetAuthPasswordResetPost } from "@/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResetPasswordRequestSent({
  email,
  reset,
}: {
  email: string;
  reset: () => void;
}) {
  const [resent, setResent] = useState<boolean>(false);
  const resend = async () => {
    await requestPasswordResetAuthPasswordResetPost({
      body: { email },
      withCredentials: true,
    });
    setResent(true);
  };
  return (
    <Card className="flex flex-col border-0 md:border px-6 sm:px-12 sm:py-3 md:max-w-lg">
      <CardHeader className="space-y-3">
        <CardTitle>Check your email</CardTitle>
      </CardHeader>
      {resent ? (
        <CardContent>
          <p className="mt-2">
            We&apos;ve resent password reset instructions to{" "}
            <span className="font-medium">{email}</span> if it is an email on
            file.
          </p>
          <p className="mt-6">
            Please check again. If you still haven&apos;t received an email,{" "}
            <span
              className="text-green-800 font-medium cursor-pointer"
              onClick={() => reset()}
            >
              try a different email
            </span>
            .
          </p>
        </CardContent>
      ) : (
        <CardContent>
          <p className="mt-2">
            Thanks! If <span className="font-medium">{email}</span> matches an
            email we have on file, then we&apos;ve sent you an email containing
            further instructions for resetting your password.
          </p>
          <p className="mt-6">
            If you haven&apos;t received an email in 5 minutes, check your spam,{" "}
            <span
              className="text-green-800 font-medium cursor-pointer"
              onClick={() => resend()}
            >
              resend
            </span>{" "}
            or{" "}
            <span
              className="text-green-800 font-medium cursor-pointer"
              onClick={() => reset()}
            >
              try a different email
            </span>
            .
          </p>
        </CardContent>
      )}
    </Card>
  );
}
