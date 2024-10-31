"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HttpStatusCode } from "axios";
import { CheckCircleIcon, CircleX } from "lucide-react";

import { completeEmailVerificationAuthEmailVerificationPut } from "@/client/services.gen";
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
import { UNVERIFIED_TIER_ID } from "@/types/billing";

export const VerifyEmail = () => {
  const VERIFY_SUCCESS_DELAY = 1;
  const VERIFY_ERROR_DELAY = 5;

  const user = useUserStore((store) => store.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const isUserUnverified =
    !user?.verified && user?.tier_id === UNVERIFIED_TIER_ID;
  const [isVerifySuccess, setIsVerifySuccess] = useState<boolean>(false);
  const [postVerifyTitle, setPostVerifyTitle] = useState<string>(
    "Verified! Redirecting you to Jippy...",
  );
  const [postVerifySubtitle, setPostVerifySubtitle] = useState<string>(
    "All done! You'll be redirected to Jippy soon. ",
  );

  const redirectAfterVerify = async () => {
    // Redirect user to Jippy home page after verifying email
    router.replace("/", { scroll: false });
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (code && isUserUnverified) {
      (async () => {
        const response =
          await completeEmailVerificationAuthEmailVerificationPut({
            query: { code },
          });
        // There is some problem where this function runs twice, causing an error
        // on the second run since the email verification is used.
        if (response.data) {
          setIsVerifySuccess(true);
          setIsLoading(false);
          timeout = setTimeout(
            redirectAfterVerify,
            VERIFY_SUCCESS_DELAY * 1000,
          );
        } else if (response.status == HttpStatusCode.Conflict) {
          // User is already verified
          setIsVerifySuccess(true);
          setPostVerifySubtitle("Relax, you're already verified! :) ");
          setIsLoading(false);
          timeout = setTimeout(
            redirectAfterVerify,
            VERIFY_SUCCESS_DELAY * 1000,
          );
          console.log("WARNING: User is already verified");
        } else if (response.status == HttpStatusCode.BadRequest) {
          // Email verification has already been used
          console.log("ERROR: Reusing old email verification code");
          setIsVerifySuccess(false);
          setPostVerifyTitle("Invalid verification link");
          setPostVerifySubtitle(
            "Check your email again! Please click the latest verification link",
          );
          setIsLoading(false);
          timeout = setTimeout(redirectAfterVerify, VERIFY_ERROR_DELAY * 1000);
        } else if (response.error) {
          if (response.status == HttpStatusCode.NotFound) {
            console.error("ERROR: Invalid verification code");
            setIsVerifySuccess(false);
            setPostVerifyTitle("Invalid verification link");
            setPostVerifySubtitle(
              "Check whether you entered the correct verification link.\nNote: Never click on a verification link that is not sent by us",
            );
            setIsLoading(false);
            timeout = setTimeout(
              redirectAfterVerify,
              VERIFY_ERROR_DELAY * 1000,
            );
          } else {
            console.error("ERROR while verifying email");
            setIsVerifySuccess(false);
            setPostVerifyTitle("Verification error");
            setPostVerifySubtitle(
              "We're very sorry, something went wrong while verifying you. Please try again later.",
            );
            setIsLoading(false);
            timeout = setTimeout(
              redirectAfterVerify,
              VERIFY_ERROR_DELAY * 1000,
            );
          }
        }
      })();
    } else if (!isUserUnverified) {
      console.log("WARNING: User is already verified");
      // User is already verified, don't make the backend verify again
      setIsVerifySuccess(true);
      setPostVerifySubtitle("Relax, you're already verified! :) ");
      setIsLoading(false);
      timeout = setTimeout(redirectAfterVerify, VERIFY_SUCCESS_DELAY * 1000);
    }

    return () => {
      if (timeout) {
        // Cleanup redirect timeout on unmount of the page
        clearTimeout(timeout);
      }
    };
  }, [code, isUserUnverified, redirectAfterVerify]);

  return (
    <Box className="flex flex-col m-auto w-full h-full justify-center items-center gap-y-10">
      <Card className="flex flex-col border-0 md:border shadow-none md:shadow-sm md:max-w-md text-center">
        <CardHeader className="space-y-3">
          <CardTitle>
            {isLoading ? "Verifying your email" : postVerifyTitle}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col space-y-8">
          <Box className="flex justify-center">
            {isLoading ? (
              <LoadingSpinner size={64} />
            ) : isVerifySuccess ? (
              <CheckCircleIcon size={64} />
            ) : (
              <CircleX size={64} />
            )}
          </Box>
          <CardDescription>
            <span className="max-w-sm whitespace-pre-line">
              {isLoading
                ? "Hang tight! We're verifying your email. This shouldn't take long."
                : postVerifySubtitle}
            </span>
            {!isLoading && isVerifySuccess && (
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
};

export default VerifyEmail;
