"use client";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getUserProfile } from "@/queries/user";
import { useUserStore } from "@/store/user/user-store-provider";

export default function RedirectIfNotAuthenticated({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const { status } = useQuery(getUserProfile());

  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const user = useUserStore((state) => state.user);
  console.log({ isLoggedIn, status });

  if (!isLoggedIn && !status) {
    router.push("/login");
  }
  if (isLoggedIn && !user!.categories.length) {
    router.push("/onboarding");
  }

  return <Suspense>{children}</Suspense>;
}
