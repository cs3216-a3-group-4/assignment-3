"use client";

import { createElement, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react";

import { CategoryDTO } from "@/client";
import { getIconFor } from "@/types/categories";

import SidebarItemWithIcon from "./sidebar-item-with-icon";

type Props = {
  label: string;
  categories: CategoryDTO[];
};

const SidebarTopics = ({ label, categories }: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const numTopics = categories?.length;

  const pathname = usePathname();
  const segments = pathname.slice(1).split("/");
  const isCategoryUrl = segments[0] === "categories";
  const activeCategoryId = segments[1];

  return (
    <div className="flex flex-col space-y-2.5 w-full max-w-xs">
      <div className="flex items-center cursor-pointer w-full justify-between">
        <h1 className="text-sm font-medium text-muted-foreground/80 px-2">
          {label} {`(${numTopics})`}
        </h1>
        {createElement(isExpanded ? ChevronsUpDownIcon : ChevronsDownUpIcon, {
          onClick: () => setIsExpanded((prevState) => !prevState),
          size: 14,
          strokeWidth: 2.4,
          className: "text-muted-foreground",
        })}
      </div>
      <div
        className={`flex flex-col space-y-2 sm:space-y-1 ${isExpanded ? "" : "hidden"}`}
      >
        {categories?.map((category) => {
          const categoryIcon = getIconFor(category.name);
          return (
            // TODO: active category
            <SidebarItemWithIcon
              Icon={categoryIcon}
              isActive={
                isCategoryUrl && activeCategoryId === category.id.toString()
              }
              key={category.id}
              label={category.name}
              path={`/categories/${category.id}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SidebarTopics;
