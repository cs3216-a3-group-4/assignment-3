import { ComponentProps } from "react";
import {
  Building2,
  DollarSign,
  Film,
  HeartHandshake,
  Leaf,
  Medal,
  Microscope,
  Palette,
  Scale,
  UsersRound,
} from "lucide-react";

import { Categories } from "@/types/categories";

import SidebarItemWithIcon from "./sidebar-item-with-icon";

interface TopicItem extends ComponentProps<typeof SidebarItemWithIcon> {}

// TODO: dynamically fetch
const otherTopics: TopicItem[] = [
  { Icon: Microscope, label: Categories.SciTech },
  { Icon: Palette, label: Categories.ArtsHumanities },
  { Icon: Building2, label: Categories.Politics },
  { Icon: Film, label: Categories.Media },
  { Icon: Leaf, label: Categories.Environment },
  { Icon: DollarSign, label: Categories.Economics },
  { Icon: Medal, label: Categories.Sports },
  { Icon: Scale, label: Categories.GenderEquality },
  { Icon: HeartHandshake, label: Categories.Religion },
  { Icon: UsersRound, label: Categories.SocietyCulture },
];

const SidebarOtherTopics = () => {
  return (
    <div className="flex flex-col space-y-2.5">
      <h1 className="text-sm font-medium text-muted-foreground/80 px-2">
        Other topics
      </h1>
      <div className="flex flex-col">
        {otherTopics.map((topicItem) => (
          <SidebarItemWithIcon key={topicItem.label} {...topicItem} />
        ))}
      </div>
    </div>
  );
};

export default SidebarOtherTopics;
