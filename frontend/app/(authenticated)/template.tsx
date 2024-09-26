"use client";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getUserProfile } from "@/queries/user";
import { useUserStore } from "@/store/user/user-store-provider";

export default function RedirectIfNotAuthenticated({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  const { isLoggedIn, setLoggedIn, setNotLoggedIn } = useUserStore(
    (state) => state,
  );
  const {
    data: userProfile,
    isSuccess: isUserProfileSuccess,
    isFetching,
  } = useQuery(getUserProfile());

  useEffect(() => {
    if (!isFetching) {
      if (!userProfile) {
        if (!isLoggedIn) {
          router.push("/login");
        }
        if (isLoggedIn && !userProfile!.categories.length) {
          router.push("/onboarding");
        }
      }
    }
  }, [
    userProfile,
    isUserProfileSuccess,
    setLoggedIn,
    setNotLoggedIn,
    isLoggedIn,
    router,
    isFetching,
  ]);

  return <Suspense>{children}</Suspense>;
}
