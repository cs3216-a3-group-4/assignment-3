import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SidebarOtherTopics from "../sidebar/sidebar-other-topics";
import DynamicBreadcrumb from "../dynamic-breadcrumb";
import { HomeIcon } from "lucide-react";
import SidebarItemWithIcon from "../sidebar/sidebar-item-with-icon";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const MobileSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  return (
    <Select
      defaultValue={pathname}
      onValueChange={() => setIsCollapsed((prevValue) => !prevValue)}
    >
      <SelectTrigger
        className={cn(
          "border-muted-foreground/20 flex max-w-full items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 max-w-full shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden",
        )}
        aria-label="Navbar"
      >
        <SelectValue>
          <DynamicBreadcrumb pathname={pathname} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="flex flex-col bg-primary-100/20 space-y-6 py-4 px-8">
          <SidebarItemWithIcon
            Icon={HomeIcon}
            isActive={pathname === "/"}
            label="Home"
            onClick={() => router.push("/")}
          />
          <SidebarOtherTopics />
        </div>
      </SelectContent>
    </Select>
  );
};

export default MobileSidebar;
