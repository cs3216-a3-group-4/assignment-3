"use client";

import { ReactNode, useState } from "react";

import Sidebar from "@/components/navigation/sidebar/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface PanelLayoutProps {
  sidebarSize: number;
  mainContentSize: number;
  children: ReactNode;
}

const PanelLayout = ({
  sidebarSize,
  mainContentSize,
  children,
}: PanelLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
  };

  return (
    <>
      <div className="flex flex-1 w-full h-full min-h-full max-h-full">
        <div className="flex w-[320px] h-full">
          <Sidebar />
        </div>
        <div className="flex flex-1 w-full h-full max-h-full !overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

export default PanelLayout;
