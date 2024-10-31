"use client";

import { ReactNode, Suspense, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import MobileNavbar from "@/components/navigation/mobile/mobile-navbar";
import Navbar from "@/components/navigation/navbar";
import UnverifiedAlert from "@/components/navigation/unverified-alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Toaster } from "@/components/ui/toaster";
import { getUserProfile } from "@/queries/user";
import { useUserStore } from "@/store/user/user-store-provider";

import ContentLayout from "./content-layout";
import { UNVERIFIED_TIER_ID } from "@/types/billing";

export const NAVBAR_HEIGHT = 84;

const AppLayout = ({ children }: { children: ReactNode }) => {
  const {
    isLoggedIn,
    setLoggedIn,
    setNotLoggedIn,
    setIsFetching,
    setIsNotFetching,
    user,
  } = useUserStore((state) => state);
  const {
    data: userProfile,
    isSuccess: isUserProfileSuccess,
    isLoading: isUserProfileLoading,
  } = useQuery(getUserProfile());
  const isUserVerified =
    user?.verified === false || user?.tier_id === UNVERIFIED_TIER_ID;

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
      <main
        // h-[calc(100vh_-_84px)] min-h-[calc(100vh_-_84px)] max-h-[calc(100vh_-_84px)]
        className={`flex flex-col w-full h-[calc(100vh_-_${NAVBAR_HEIGHT}px)] min-h-[calc(100vh_-_${NAVBAR_HEIGHT}px)] max-h-[calc(100vh_-_${NAVBAR_HEIGHT}px)]`}
      >
        <Suspense
          fallback={
            <div className="flex flex-1 w-full h-full max-h-full !overflow-y-auto justify-center items-center">
              <LoadingSpinner className="w-24 h-24" />
            </div>
          }
        >
          {isLoggedIn && isUserVerified && (
            <div className="h-fit flex flex-col w-full items-stretch">
              <UnverifiedAlert />
            </div>
          )}
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
