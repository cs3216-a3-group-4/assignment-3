import { ComponentProps } from "react";

import {
  categoriesToDisplayName,
  categoriesToIconsMap,
  Category,
} from "@/types/categories";

import SidebarItemWithIcon from "./sidebar-item-with-icon";

// TODO: dynamically fetch
const otherTopics = [
  Category.SciTech,
  Category.ArtsHumanities,
  Category.Politics,
  Category.Media,
  Category.Environment,
  Category.Economics,
  Category.Sports,
  Category.GenderEquality,
  Category.Religion,
  Category.SocietyCulture,
];

const SidebarOtherTopics = () => {
  return (
    <div className="flex flex-col space-y-2.5">
      <h1 className="text-sm font-medium text-muted-foreground/80 px-2">
        Other topics
      </h1>
      <div className="flex flex-col">
        {otherTopics.map((topicItem) => {
          const categoryLabel = categoriesToDisplayName[topicItem];
          const categoryIcon = categoriesToIconsMap[topicItem];
          return (
            <SidebarItemWithIcon
              key={categoryLabel}
              label={categoryLabel}
              Icon={categoryIcon}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SidebarOtherTopics;
