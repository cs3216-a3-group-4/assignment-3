"use client";

import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/queries/category";
import { getIconFor } from "@/types/categories";

import SidebarItemWithIcon from "./sidebar-item-with-icon";

const SidebarOtherTopics = () => {
  const { data: categories } = useQuery(getCategories());

  return (
    <div className="flex flex-col space-y-2.5">
      <h1 className="text-sm font-medium text-muted-foreground/80 px-2">
        Other topics
      </h1>
      <div className="flex flex-col">
        {categories?.map((category) => {
          const categoryIcon = getIconFor(category.name);
          return (
            <SidebarItemWithIcon
              Icon={categoryIcon}
              categoryId={category.id}
              key={category.id}
              label={category.name}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SidebarOtherTopics;
