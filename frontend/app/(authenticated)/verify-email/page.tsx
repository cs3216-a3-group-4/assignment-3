"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircleIcon } from "lucide-react";

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
import { completeEmailVerificationAuthEmailVerificationPut } from "@/client/services.gen";
import { HttpStatusCode } from "axios";

export const UNVERIFIED_TIER_ID = 4;
export const VERIFY_SUCCESS_DELAY = 1;

export default function VerifyEmail() {
  const user = useUserStore((store) => store.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const isUserUnverified = !user?.verified && user?.tier_id === UNVERIFIED_TIER_ID;
  const [postVerifyMessage, setPostVerifyMessage] = useState<string>("All done! You'll be redirected to Jippy soon. ");

  const redirectAfterVerify = async () => {
    // Redirect user to Jippy home page after verifying email
    router.replace("/", { scroll: false });
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (code && isUserUnverified) {
      (async () => {
        const response = await completeEmailVerificationAuthEmailVerificationPut({
          query: { code },
        });
        // There is some problem where this function runs twice, causing an error
        // on the second run since the email verification is used.
        if (response.data) {
          setIsLoading(false);
          timeout = setTimeout(redirectAfterVerify, VERIFY_SUCCESS_DELAY * 1000);
        } else if (response.status == HttpStatusCode.Conflict) {
          // User is already verified
          setPostVerifyMessage("Relax, you're already verified! :) ");
          setIsLoading(false);
          timeout = setTimeout(redirectAfterVerify, VERIFY_SUCCESS_DELAY * 1000);
          console.log("WARNING: User is already verified");
        } else if (response.error) {
          console.error("Error completing email verification: ", response.error);
        }
      })();
    } else if (!isUserUnverified) {
      console.log("WARNING: User is already verified");
      // User is already verified, don't make the backend verify again
      setPostVerifyMessage("Relax, you're already verified! :) ");
      setIsLoading(false);
      timeout = setTimeout(redirectAfterVerify, VERIFY_SUCCESS_DELAY * 1000);
    }

    return () => {
      if (timeout) {
        // Cleanup redirect timeout on unmount of the page
        clearTimeout(timeout);
      }
    };
  }, [code, user]);

  return (
    <Box className="flex flex-col m-auto w-full h-full justify-center items-center gap-y-10">
      <Card className="flex flex-col border-0 md:border shadow-none md:shadow-sm md:max-w-md text-center">
        <CardHeader className="space-y-3">
          <CardTitle>
            {isLoading ? "Verifying your email" : "Verified! Redirecting you to Jippy..."}
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
                ? "Hang tight! We're verifying your email. This shouldn't take long."
                : postVerifyMessage}
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
