"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircleIcon } from "lucide-react";

import { completeEmailVerificationAuthVerifyEmailPut } from "@/client";
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

export default function VerifyEmail() {
  const router = useRouter();
  const setLoggedIn = useUserStore((state) => state.setLoggedIn);
  const sentAuthentication = useRef(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (!sentAuthentication.current) {
      sentAuthentication.current = true;
      (async () => {
        if (!code) {
          router.push("/login");
          return;
        }
        const response = await completeEmailVerificationAuthVerifyEmailPut({
          query: { code },
        });
        // There is some problem where this function runs twice, causing an error
        // on the second run since the email verification is used.
        if (response.data) {
          setIsLoading(false);
          setLoggedIn(response.data!.user);
          router.push("/");
        }
      })();
    }
  }, [code, router, setLoggedIn]);

  return (
    <Box className="flex flex-col m-auto w-full justify-center items-center gap-y-10">
      <Card className="flex flex-col border-0 md:border px-6 sm:px-12 sm:py-6 shadow-none md:shadow-sm md:max-w-md text-center">
        <CardHeader className="space-y-3">
          <CardTitle>Verifying your email</CardTitle>
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
                : "All done! You should be redirected soon."}
            </span>
            {!isLoading && (
              <Link className="p-2" href={"/"} size={"sm"}>
                Redirect now
              </Link>
            )}
          </CardDescription>
        </CardContent>
      </Card>
    </Box>
  );
}
