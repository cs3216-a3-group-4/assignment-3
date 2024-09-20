"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircleIcon } from "lucide-react";

import { authGoogleAuthGoogleGet } from "@/client";
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

export default function GoogleOAuth() {
  const router = useRouter();
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
        await authGoogleAuthGoogleGet({ query: { code } });
        setIsLoading(false);
        router.push("/");
      })();
    }
  }, [code, router]);

  return (
    <Box className="flex flex-col m-auto w-full justify-center items-center gap-y-10">
      <Card className="flex flex-col border-0 md:border px-6 sm:px-12 sm:py-6 shadow-none md:shadow-sm md:max-w-md text-center">
        <CardHeader className="space-y-3">
          <CardTitle>Sign in with Google</CardTitle>
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
