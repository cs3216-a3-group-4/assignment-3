"use client";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useUserStore } from "@/store/user/user-store-provider";

export default function RedirectIfNotAuthenticated({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  const { isLoggedIn, isFetching, user } = useUserStore((state) => state);

  useEffect(() => {
    if (isFetching) return;
    if (!isLoggedIn) {
      // Assume unauthenticated
      router.push("/login");
    }

    if (isLoggedIn && user && user.categories.length === 0) {
      router.push("/onboarding");
    }
  }, [isFetching, isLoggedIn, user, router]);

  return <Suspense>{children}</Suspense>;
}
