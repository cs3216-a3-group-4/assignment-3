"use client";

import { ReactNode, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import Navbar from "@/components/navigation/navbar";
import { Toaster } from "@/components/ui/toaster";
import { getUserProfile } from "@/queries/user";
import { useUserStore } from "@/store/user/user-store-provider";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { setLoggedIn, setNotLoggedIn } = useUserStore((state) => state);
  const { data: userProfile, isSuccess: isUserProfileSuccess } =
    useQuery(getUserProfile());

  useEffect(() => {
    if (isUserProfileSuccess && userProfile) {
      setLoggedIn(userProfile.id, userProfile.email);
    } else {
      setNotLoggedIn();
    }
  }, [userProfile, isUserProfileSuccess, setLoggedIn, setNotLoggedIn]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="w-full flex flex-1">{children}</main>
      <Toaster />
    </div>
  );
};

export default AppLayout;
