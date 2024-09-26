"use client";

import { ComponentProps, ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Toaster } from "@/components/ui/toaster";
import useBreakpointMediaQuery from "@/hooks/use-breakpoint-media-query";
import { getUserProfile } from "@/queries/user";
import { useUserStore } from "@/store/user/user-store-provider";
import { MediaBreakpoint } from "@/utils/media";

const breakpointConfigMap: Record<
  MediaBreakpoint,
  ComponentProps<typeof ResizablePanel>
> = {
  [MediaBreakpoint.Sm]: {
    defaultSize: 25,
    maxSize: 60,
    minSize: 20,
    collapsible: true,
    collapsedSize: 1,
  },
  [MediaBreakpoint.Md]: {
    defaultSize: 20,
    maxSize: 40,
    minSize: 10,
    collapsible: true,
    collapsedSize: 1,
  },
  [MediaBreakpoint.Lg]: {
    defaultSize: 20,
    maxSize: 40,
    minSize: 20,
    collapsible: true,
    collapsedSize: 1,
  },
  [MediaBreakpoint.Xl]: {
    defaultSize: 16,
    maxSize: 35,
    minSize: 15,
    collapsible: true,
    collapsedSize: 1,
  },
  [MediaBreakpoint.Xxl]: {
    defaultSize: 10,
    maxSize: 25,
    minSize: 15,
    collapsible: true,
    collapsedSize: 1,
  },
  [MediaBreakpoint.Xxxl]: {
    defaultSize: 8,
    maxSize: 25,
    minSize: 5,
    collapsible: true,
    collapsedSize: 1,
  },
};

const AppLayout = ({ children }: { children: ReactNode }) => {
  const mediaBreakpoint = useBreakpointMediaQuery();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const { isLoggedIn, setLoggedIn, setNotLoggedIn } = useUserStore(
    (state) => state,
  );
  const { data: userProfile, isSuccess: isUserProfileSuccess } =
    useQuery(getUserProfile());

  useEffect(() => {
    if (isUserProfileSuccess && userProfile) {
      setLoggedIn(userProfile);
    } else {
      setNotLoggedIn();
    }
  }, [userProfile, isUserProfileSuccess, setLoggedIn, setNotLoggedIn]);

  const pathname = usePathname();
  const isOnboarding = pathname === "/onboarding";

  return (
    <div className="relative flex min-h-screen max-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex w-full h-[calc(100vh_-_84px)] min-h-[calc(100vh_-_84px)] max-h-[calc(100vh_-_84px)]">
        {isOnboarding ? (
          children
        ) : (
          <ResizablePanelGroup
            className="flex flex-1 w-full h-full min-h-full max-h-full"
            direction="horizontal"
          >
            {isLoggedIn && (
              <>
                <ResizablePanel
                  className="flex w-full h-full"
                  id="sidebar"
                  onCollapse={() => setIsCollapsed(true)}
                  onExpand={() => setIsCollapsed(false)}
                  order={1}
                  {...breakpointConfigMap[mediaBreakpoint]}
                >
                  <Sidebar />
                </ResizablePanel>
                <ResizableHandle withHandle={isCollapsed} />
              </>
            )}
            <ResizablePanel
              className="flex flex-1 w-full h-full max-h-full !overflow-y-auto"
              defaultSize={75}
              order={2}
            >
              {children}
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </main>
      <Toaster />
    </div>
  );
};

export default AppLayout;
