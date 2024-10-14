"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import useBreakpointMediaQuery from "@/hooks/use-breakpoint-media-query";
import { useUserStore } from "@/store/user/user-store-provider";
import { MediaBreakpoint } from "@/utils/media";

import PanelLayout from "./panel-layout";

interface ContentLayoutProps {
  isLoading: boolean;
  children: ReactNode;
}

const sidebarBreakpointConfigMap: Record<MediaBreakpoint, number> = {
  [MediaBreakpoint.Sm]: 0,
  [MediaBreakpoint.Md]: 20,
  [MediaBreakpoint.Lg]: 20,
  [MediaBreakpoint.Xl]: 16,
  [MediaBreakpoint.Xxl]: 10,
  [MediaBreakpoint.Xxxl]: 8,
};

const mainBreakpointConfigMap: Record<MediaBreakpoint, number> = {
  [MediaBreakpoint.Sm]: 100,
  [MediaBreakpoint.Md]: 80,
  [MediaBreakpoint.Lg]: 80,
  [MediaBreakpoint.Xl]: 84,
  [MediaBreakpoint.Xxl]: 94,
  [MediaBreakpoint.Xxxl]: 92,
};

// warning: don't read, you'll vomit. i am desperate.
const ContentLayout = ({ isLoading, children }: ContentLayoutProps) => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const mediaBreakpoint = useBreakpointMediaQuery();
  const pathname = usePathname();
  const isOnboarding = pathname === "/onboarding";

  // TODO: fix all loading elements
  if (isLoading)
    return (
      <div className="flex flex-1 w-full h-full max-h-full !overflow-y-auto justify-center items-center">
        <LoadingSpinner className="w-24 h-24" />
      </div>
    );

  if (isOnboarding)
    return (
      <div className="flex flex-1 w-full h-full max-h-full !overflow-y-auto justify-center">
        {children}
      </div>
    );

  if (!isLoggedIn)
    return (
      <div className="flex flex-1 w-full h-full max-h-full !overflow-y-auto">
        {children}
      </div>
    );

  // Assumed must be logged in from here
  if (mediaBreakpoint === MediaBreakpoint.Xxxl)
    return (
      <PanelLayout
        mainContentSize={mainBreakpointConfigMap[MediaBreakpoint.Xxxl]}
        sidebarSize={sidebarBreakpointConfigMap[MediaBreakpoint.Xxxl]}
      >
        {children}
      </PanelLayout>
    );

  if (mediaBreakpoint === MediaBreakpoint.Xxl)
    return (
      <PanelLayout
        mainContentSize={mainBreakpointConfigMap[MediaBreakpoint.Xxl]}
        sidebarSize={sidebarBreakpointConfigMap[MediaBreakpoint.Xxl]}
      >
        {children}
      </PanelLayout>
    );

  if (mediaBreakpoint === MediaBreakpoint.Xl)
    return (
      <PanelLayout
        mainContentSize={mainBreakpointConfigMap[MediaBreakpoint.Xl]}
        sidebarSize={sidebarBreakpointConfigMap[MediaBreakpoint.Xl]}
      >
        {children}
      </PanelLayout>
    );

  if (mediaBreakpoint === MediaBreakpoint.Lg)
    return (
      <PanelLayout
        mainContentSize={mainBreakpointConfigMap[MediaBreakpoint.Lg]}
        sidebarSize={sidebarBreakpointConfigMap[MediaBreakpoint.Lg]}
      >
        {children}
      </PanelLayout>
    );

  if (mediaBreakpoint === MediaBreakpoint.Md)
    return (
      <PanelLayout
        mainContentSize={mainBreakpointConfigMap[MediaBreakpoint.Md]}
        sidebarSize={sidebarBreakpointConfigMap[MediaBreakpoint.Md]}
      >
        {children}
      </PanelLayout>
    );

  // For `sm` and `xs` breakpoints don't render anything
  return (
    <div
      className="flex flex-1 w-full h-full max-h-full !overflow-y-auto relative"
      id="main-content"
    >
      {children}
    </div>
  );
};

export default ContentLayout;
