"use client";

import { ReactNode, Suspense, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import MobileNavbar from "@/components/navigation/mobile/mobile-navbar";
import Navbar from "@/components/navigation/navbar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Toaster } from "@/components/ui/toaster";
import { getUserProfile } from "@/queries/user";
import { useUserStore } from "@/store/user/user-store-provider";

import ContentLayout from "./content-layout";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { setLoggedIn, setNotLoggedIn, setIsFetching, setIsNotFetching } =
    useUserStore((state) => state);
  const {
    data: userProfile,
    isSuccess: isUserProfileSuccess,
    isLoading: isUserProfileLoading,
  } = useQuery(getUserProfile());

  useEffect(() => {
    if (isUserProfileLoading) {
      setIsFetching();
      return;
    }

    if (isUserProfileSuccess && userProfile) {
      setLoggedIn(userProfile);
    } else {
      setNotLoggedIn();
    }

    setIsNotFetching();
  }, [
    userProfile,
    isUserProfileSuccess,
    isUserProfileLoading,
    setLoggedIn,
    setIsFetching,
    setIsNotFetching,
    setNotLoggedIn,
  ]);

  return (
    <div className="relative flex min-h-screen max-h-screen flex-col bg-background">
      <Navbar />
      <MobileNavbar />
      <main className="flex w-full h-[calc(100vh_-_84px)] min-h-[calc(100vh_-_84px)] max-h-[calc(100vh_-_84px)]">
        <Suspense
          fallback={
            <div className="flex flex-1 w-full h-full max-h-full !overflow-y-auto justify-center items-center">
              <LoadingSpinner className="w-24 h-24" />
            </div>
          }
        >
          <ContentLayout isLoading={isUserProfileLoading}>
            {children}
          </ContentLayout>
        </Suspense>
      </main>
      <Toaster />
    </div>
  );
};

export default AppLayout;
