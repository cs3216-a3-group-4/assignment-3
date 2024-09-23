"use client";

import { ComponentProps, ReactNode, useEffect, useState } from "react";
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
    defaultSize: 30,
    maxSize: 35,
    minSize: 10,
    collapsible: true,
    collapsedSize: 1,
  },
  [MediaBreakpoint.Md]: {
    defaultSize: 25,
    maxSize: 40,
    minSize: 20,
    collapsible: true,
    collapsedSize: 1,
  },
  [MediaBreakpoint.Lg]: {
    defaultSize: 25,
    maxSize: 40,
    minSize: 20,
    collapsible: true,
    collapsedSize: 1,
  },
  [MediaBreakpoint.Xl]: {
    defaultSize: 20,
    maxSize: 35,
    minSize: 15,
    collapsible: true,
    collapsedSize: 1,
  },
  [MediaBreakpoint.XXl]: {
    defaultSize: 25,
    maxSize: 35,
    minSize: 15,
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
      setLoggedIn(userProfile.id, userProfile.email);
    } else {
      setNotLoggedIn();
    }
  }, [userProfile, isUserProfileSuccess, setLoggedIn, setNotLoggedIn]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      <main>
        <ResizablePanelGroup
          className="flex flex-1 w-full h-[calc(100vh_-_72px)]"
          direction="horizontal"
        >
          {isLoggedIn && (
            <>
              <ResizablePanel
                className="flex w-full"
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
          <ResizablePanel defaultSize={75} order={2}>
            <div className="flex flex-1 w-full h-[calc(100vh_-_72px)] min-h-[calc(100vh_-_72px)] overflow-y-scroll">
              {children}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
      <Toaster />
    </div>
  );
};

export default AppLayout;
