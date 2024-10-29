"use client";

import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  BlocksIcon,
  BookmarkIcon,
  BookOpenCheckIcon,
  FileClockIcon,
  HistoryIcon,
  HomeIcon,
  NewspaperIcon,
  NotebookIcon,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { getCategories } from "@/queries/category";
import { useUserStore } from "@/store/user/user-store-provider";

import SidebarItemWithIcon from "./sidebar-item-with-icon";

/* Assumption: This component is only rendered if the user is logged in */
const Sidebar = () => {
  const pathname = usePathname();

  const { data: categories, isSuccess } = useQuery(getCategories());
  const user = useUserStore((state) => state.user);
  const userCategoryIds = user?.categories.map((category) => category.id) || [];
  // const otherCategories = categories?.filter(
  //   (category) => !userCategoryIds.includes(category.id),
  // );

  return (
    <div className="sticky flex flex-col h-[calc(100vh_-_72px)] w-full px-4 py-6 bg-primary-100/20 space-y-4 overflow-y-auto">
      <div className="flex flex-col space-y-2 w-full">
        <SidebarItemWithIcon
          Icon={HomeIcon}
          isActive={pathname === "/"}
          label="Home"
          path="/"
        />
        <SidebarItemWithIcon
          Icon={NewspaperIcon}
          isActive={pathname === "/articles"}
          label="Articles"
          path="/articles"
        />

        <SidebarItemWithIcon
          Icon={BookOpenCheckIcon}
          isActive={pathname === "/essay-feedback"}
          label="Essay feedback"
          path="/essay-feedback"
        />

        <SidebarItemWithIcon
          Icon={BlocksIcon}
          isActive={pathname === "/ask"}
          label="Essay helper"
          path="/ask"
        />
      </div>
      <Separator className="bg-text-muted/20" />
      <div className="flex flex-col space-y-2 w-full">
        <SidebarItemWithIcon
          Icon={BookmarkIcon}
          isActive={pathname === "/bookmarks"}
          label="Bookmarks"
          path="/bookmarks"
        />
        <SidebarItemWithIcon
          Icon={NotebookIcon}
          isActive={pathname === "/notes"}
          label="Notes"
          path="/notes"
        />
        <SidebarItemWithIcon
          Icon={FileClockIcon}
          isActive={pathname === "/essay-feedback/history"}
          label="My essays"
          path="/essay-feedback/history"
        />
        <SidebarItemWithIcon
          Icon={HistoryIcon}
          isActive={pathname === "/questions"}
          label="Past questions"
          path="/questions"
        />
      </div>
      {isSuccess && (
        <>
          {/* <SidebarTopics categories={user!.categories} label={"Your topics"} />
          <SidebarTopics categories={otherCategories!} label={"Other topics"} /> */}
        </>
      )}
    </div>
  );
};

export default Sidebar;
