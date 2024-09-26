"use client";

import { createElement, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react";

import { getCategories } from "@/queries/category";
import { getIconFor } from "@/types/categories";

import SidebarItemWithIcon from "./sidebar-item-with-icon";

const SidebarOtherTopics = () => {
  const router = useRouter();
  const { data: categories, isSuccess } = useQuery(getCategories());
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const numTopics = categories?.length;

  return (
    <div className="flex flex-col space-y-2.5 w-full max-w-xs">
      <div className="flex items-center cursor-pointer w-full justify-between">
        <h1 className="text-sm font-medium text-muted-foreground/80 px-2">
          Other topics {isSuccess && `(${numTopics})`}
        </h1>
        {createElement(isExpanded ? ChevronsUpDownIcon : ChevronsDownUpIcon, {
          onClick: () => setIsExpanded((prevState) => !prevState),
          size: 14,
          strokeWidth: 2.4,
          className: "text-muted-foreground",
        })}
      </div>
      <div className={`flex flex-col ${isExpanded ? "" : "hidden"}`}>
        {categories?.map((category) => {
          const categoryIcon = getIconFor(category.name);
          const onClick = () => router.push(`/categories/${category.id}`);
          return (
            // TODO: active category
            <SidebarItemWithIcon
              Icon={categoryIcon}
              key={category.id}
              label={category.name}
              onClick={onClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SidebarOtherTopics;
