"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BookmarkIcon,
  HistoryIcon,
  HomeIcon,
  MessageCircleQuestionIcon,
} from "lucide-react";

import DynamicBreadcrumb from "@/components/navigation/dynamic-breadcrumb";
import SidebarItemWithIcon from "@/components/navigation/sidebar/sidebar-item-with-icon";
import SidebarOtherTopics from "@/components/navigation/sidebar/sidebar-other-topics";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const MobileSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  return (
    <Select
      defaultValue={pathname}
      onValueChange={() => setIsCollapsed((prevValue) => !prevValue)}
    >
      <SelectTrigger
        aria-label="Navbar"
        className={cn(
          "border-muted-foreground/20 flex max-w-full items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 max-w-full shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden",
        )}
      >
        <SelectValue>
          <DynamicBreadcrumb pathname={pathname} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="flex flex-col bg-primary-100/20 space-y-6 py-4 px-8">
          <div className="flex flex-col space-y-2">
            <SidebarItemWithIcon
              Icon={HomeIcon}
              isActive={pathname === "/"}
              label="Home"
              onClick={() => router.push("/")}
            />
            <SidebarItemWithIcon
              Icon={BookmarkIcon}
              isActive={pathname === "/bookmarks"}
              label="Bookmarks"
              onClick={() => router.push("/bookmarks")}
            />
            <SidebarItemWithIcon
              Icon={MessageCircleQuestionIcon}
              isActive={pathname === "/ask"}
              label="Ask a question"
              onClick={() => router.push("/ask")}
            />
            <SidebarItemWithIcon
              Icon={HistoryIcon}
              isActive={pathname === "/questions"}
              label="Past questions"
              onClick={() => router.push("/questions")}
            />
          </div>
          <SidebarOtherTopics />
        </div>
      </SelectContent>
    </Select>
  );
};

export default MobileSidebar;
