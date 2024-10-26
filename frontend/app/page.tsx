"use client";

import Home from "@/app/(authenticated)/home/page";
import Landing from "@/app/landing";
import { useUserStore } from "@/store/user/user-store-provider";

const RootPage = () => {
  const isLoggedIn = useUserStore((store) => store.isLoggedIn);

  if (isLoggedIn === undefined) {
    return <>Loading</>;
  }

  return isLoggedIn ? <Home /> : <Landing />;
};

export default RootPage;
