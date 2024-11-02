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
      <ResizablePanelGroup
        className="flex flex-1 w-full h-full min-h-full max-h-full"
        direction="horizontal"
        onLayout={onLayout}
      >
        <ResizablePanel
          className="flex w-full h-full"
          collapsedSize={1}
          collapsible
          defaultSize={sidebarSize}
          id="sidebar"
          minSize={1}
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
          order={1}
        >
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle withHandle={isCollapsed} />

        <ResizablePanel
          className="flex flex-col flex-1 w-screen h-full max-h-full !overflow-y-auto relative"
          defaultSize={mainContentSize}
          id="main-content"
          order={2}
        >
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

export default PanelLayout;
