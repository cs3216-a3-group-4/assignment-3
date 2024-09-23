"use client";

import Home from "@/app/home";
import Landing from "@/app/landing";
import { useUserStore } from "@/store/user/user-store-provider";

const RootPage = () => {
  const isLoggedIn = useUserStore((store) => store.isLoggedIn);
  return isLoggedIn ? <Home /> : <Landing />;
};

export default RootPage;
