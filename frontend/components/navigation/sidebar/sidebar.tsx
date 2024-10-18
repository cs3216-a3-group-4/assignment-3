"use client";

import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  BookmarkIcon,
  BookOpenCheckIcon,
  HistoryIcon,
  HomeIcon,
  MessageCircleQuestionIcon,
  NotebookIcon,
} from "lucide-react";

import SidebarTopics from "@/components/navigation/sidebar/sidebar-topics";
import { getCategories } from "@/queries/category";
import { useUserStore } from "@/store/user/user-store-provider";

import SidebarItemWithIcon from "./sidebar-item-with-icon";

/* Assumption: This component is only rendered if the user is logged in */
const Sidebar = () => {
  const pathname = usePathname();

  const { data: categories, isSuccess } = useQuery(getCategories());
  const user = useUserStore((state) => state.user);
  const userCategoryIds = user?.categories.map((category) => category.id) || [];
  const otherCategories = categories?.filter(
    (category) => !userCategoryIds.includes(category.id),
  );

  return (
    <div className="sticky flex flex-col h-[calc(100vh_-_72px)] w-full px-4 py-6 bg-primary-100/20 space-y-6 overflow-y-auto">
      <div className="flex flex-col space-y-2.5 w-full max-w-xs">
        {/* TODO: active category */}
        <SidebarItemWithIcon
          Icon={HomeIcon}
          isActive={pathname === "/"}
          label="Home"
          path="/"
        />
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
          Icon={BookOpenCheckIcon}
          isActive={pathname === "/essay-feedback"}
          label="Essay feedback"
          path="/essay-feedback"
        />
        <SidebarItemWithIcon
          Icon={MessageCircleQuestionIcon}
          isActive={pathname === "/ask"}
          label="Ask a question"
          path="/ask"
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
          <SidebarTopics categories={user!.categories} label={"Your topics"} />
          <SidebarTopics categories={otherCategories!} label={"Other topics"} />
        </>
      )}
    </div>
  );
};

export default Sidebar;
