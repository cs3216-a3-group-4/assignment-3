"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BookmarkIcon,
  HistoryIcon,
  HomeIcon,
  LucideIcon,
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

type SidebarOption = {
  icon: LucideIcon;
  label: string;
  path: string;
};

const OPTIONS: SidebarOption[] = [
  {
    icon: HomeIcon,
    label: "Home",
    path: "/",
  },
  {
    icon: BookmarkIcon,
    label: "Bookmarks",
    path: "/bookmarks",
  },
  { icon: MessageCircleQuestionIcon, label: "Ask a question", path: "/ask" },
  { icon: HistoryIcon, label: "Past questions", path: "/questions" },
];

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
            {OPTIONS.map(({ icon, label, path }, index) => (
              <SidebarItemWithIcon
                Icon={icon}
                isActive={pathname === path}
                key={index}
                label={label}
                onClick={() => router.push(path)}
              />
            ))}
          </div>
          <SidebarOtherTopics />
        </div>
      </SelectContent>
    </Select>
  );
};

export default MobileSidebar;
