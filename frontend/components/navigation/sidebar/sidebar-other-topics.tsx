import { createElement, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react";

import {
  categoriesToDisplayName,
  categoriesToIconsMap,
  Category,
} from "@/types/categories";

import SidebarItemWithIcon from "./sidebar-item-with-icon";

// TODO: dynamically fetch
const otherTopics: Category[] = [
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
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const numTopics = otherTopics.length;

  return (
    <div className="flex flex-col space-y-2.5 w-full max-w-xs">
      <div className="flex items-center cursor-pointer w-full justify-between">
        <h1 className="text-sm font-medium text-muted-foreground/80 px-2">
          Other topics ({numTopics})
        </h1>
        {createElement(isExpanded ? ChevronsUpDownIcon : ChevronsDownUpIcon, {
          onClick: () => setIsExpanded((prevState) => !prevState),
          size: 14,
          strokeWidth: 2.4,
          className: "text-muted-foreground",
        })}
      </div>
      <div className={`flex flex-col ${isExpanded ? "" : "hidden"}`}>
        {otherTopics.map((category) => {
          const categoryLabel = categoriesToDisplayName[category];
          const categoryIcon = categoriesToIconsMap[category];
          return (
            // TODO: active category
            <SidebarItemWithIcon
              Icon={categoryIcon}
              key={category}
              label={categoryLabel}
              // TODO: fix this once merged with main
              onClick={() => router.push(`/categories/${category}`)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SidebarOtherTopics;
