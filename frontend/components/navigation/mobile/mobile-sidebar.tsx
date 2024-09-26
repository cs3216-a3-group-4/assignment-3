import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { NavItem } from "@/types/navigation";
import SidebarOtherTopics from "../sidebar/sidebar-other-topics";

// export const NavItems: NavItem[] = ["Home"];

const MobileSidebar = () => {
  //   const [selectedAccount, setSelectedAccount] = useState<NavItem>(
  //     accounts[0].email,
  //   );

  const setSelectedAccount = () => {};
  const isCollapsed = false;

  return (
    <Select defaultValue={"selectedAccount"} onValueChange={setSelectedAccount}>
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden",
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">test</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SidebarOtherTopics />
      </SelectContent>
    </Select>
  );
};

export default MobileSidebar;
