"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  BlocksIcon,
  BookmarkIcon,
  BookOpenCheckIcon,
  FileClockIcon,
  HistoryIcon,
  HomeIcon,
  LucideIcon,
  MenuIcon,
  NewspaperIcon,
  NotebookIcon,
} from "lucide-react";

import SidebarItemWithIcon from "@/components/navigation/sidebar/sidebar-item-with-icon";
import SidebarTopics from "@/components/navigation/sidebar/sidebar-topics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCategories } from "@/queries/category";
import { useUserStore } from "@/store/user/user-store-provider";

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
    icon: NewspaperIcon,
    label: "Articles",
    path: "/articles",
  },
  {
    icon: BookmarkIcon,
    label: "Bookmarks",
    path: "/bookmarks",
  },
  {
    icon: NotebookIcon,
    label: "Notes",
    path: "/notes",
  },
  {
    icon: BookOpenCheckIcon,
    label: "Essay feedback",
    path: "/essay-feedback",
  },
  {
    icon: FileClockIcon,
    label: "My essays",
    path: "/essay-feedback/history",
  },
  { icon: BlocksIcon, label: "Essay helper", path: "/ask" },
  { icon: HistoryIcon, label: "Past questions", path: "/questions" },
];

const MobileSidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const { data: categories, isSuccess } = useQuery(getCategories());
  const user = useUserStore((state) => state.user);
  const userCategoryIds = user?.categories.map((category) => category.id) || [];
  const otherCategories = categories?.filter(
    (category) => !userCategoryIds.includes(category.id),
  );

  useEffect(() => {
    if (!isCollapsed) {
      setIsCollapsed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="md:hidden" key={pathname}>
      <Button onClick={() => setIsCollapsed(false)} variant={"ghost"}>
        <MenuIcon />
      </Button>
      {
        <>
          <div
            className={cn(
              "left-0 top-0 absolute w-screen min-h-screen z-[100001]",
              {
                "bg-black/20": !isCollapsed,
                hidden: isCollapsed,
              },
            )}
            onClick={() => setIsCollapsed(true)}
          ></div>
          <div
            className={cn(
              "absolute top-0 flex flex-col bg-primary-100 space-y-6 w-[calc(100vw-6rem)] mr-24 min-h-screen transition-all duration-100 z-[100002]",
              {
                "animate-slide-right": !isCollapsed,
                "animate-slide-left": isCollapsed,
              },
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col bg-primary-100/20 space-y-6 py-4 px-8 h-screen overflow-y-auto">
              <div className="border-b-2 border-primary-500/20 py-4 flex flex-col gap-1">
                <h1 className="text-medium">Jippy</h1>
                <p className="text-slate-500">{user?.email}</p>
              </div>
              <div className="flex flex-col space-y-2">
                {OPTIONS.map(({ icon, label, path }, index) => (
                  <SidebarItemWithIcon
                    Icon={icon}
                    isActive={pathname === path}
                    key={index}
                    label={label}
                    path={path}
                  />
                ))}
              </div>
              {isSuccess && (
                <>
                  <SidebarTopics
                    categories={user!.categories}
                    label={"Your topics"}
                  />
                  <SidebarTopics
                    categories={otherCategories!}
                    label={"Other topics"}
                  />
                </>
              )}
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default MobileSidebar;
