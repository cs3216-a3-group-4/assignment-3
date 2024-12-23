"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Home from "@/app/(authenticated)/home/page";
import Landing from "@/app/landing";
import { useUserStore } from "@/store/user/user-store-provider";

const RootPage = () => {
  const router = useRouter();
  const { isLoggedIn, isFetching, user } = useUserStore((state) => state);

  useEffect(() => {
    if (isFetching) return;

    if (isLoggedIn && user && user.categories.length === 0) {
      router.push("/onboarding");
    }
  }, [isFetching, isLoggedIn, user, router]);

  if (isFetching || isLoggedIn === undefined) {
    return <>Loading</>;
  }

  return isLoggedIn ? <Home /> : <Landing />;
};

export default RootPage;
