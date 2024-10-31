"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircleIcon } from "lucide-react";

import Link from "@/components/navigation/link";
import { Box } from "@/components/ui/box";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useUserStore } from "@/store/user/user-store-provider";

export const UNVERIFIED_TIER_ID = 4;
export const VERIFY_SUCCESS_DELAY = 1;

export default function VerifyEmail() {
  const user = useUserStore((store) => store.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const redirectAfterVerify = () => {
    if (window.history?.length && window.history.length > 1) {
      // Redirect the user to their previously accessed page after successful verification
      router.back();
    } else {
      // User has no previous page in browser history, redirect user to Jippy home page
      router.replace("/", { scroll: false });
    }
  };

  useEffect(() => {
    const timeout = null;
    if (code && user?.tier_id === UNVERIFIED_TIER_ID) {
      (async () => {
        /* const response = await completeEmailVerificationAuthVerifyEmailPut({
          query: { code },
        });
        // There is some problem where this function runs twice, causing an error
        // on the second run since the email verification is used.
        if (response.data) {
          setIsLoading(false);
          const timeout = setTimeout(redirectAfterVerify, VERIFY_SUCCESS_DELAY * 1000);
        } */
      })();
    }
    if (timeout) {
      // Cleanup redirect timeout on unmount of the page
      return () => clearTimeout(timeout);
    }
  }, [code, user]);

  return (
    <Box className="flex flex-col m-auto w-full h-full justify-center items-center gap-y-10">
      <Card className="flex flex-col border-0 md:border shadow-none md:shadow-sm md:max-w-md text-center">
        <CardHeader className="space-y-3">
          <CardTitle>
            {isLoading ? "Verifying your email" : "Verified! Logging you in"}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col space-y-8">
          <Box className="flex justify-center">
            {isLoading ? (
              <LoadingSpinner size={64} />
            ) : (
              <CheckCircleIcon size={64} />
            )}
          </Box>
          <CardDescription>
            <span className="max-w-sm">
              {isLoading
                ? "Hang tight! We're logging you in. This shouldn't take too long."
                : "All done! You'll be redirected soon. "}
            </span>
            {!isLoading && (
                <span
                  className="underline cursor-pointer"
                  onClick={redirectAfterVerify}
                >
                  Redirect now
                </span>
            )}
          </CardDescription>
        </CardContent>
      </Card>
    </Box>
  );
}
