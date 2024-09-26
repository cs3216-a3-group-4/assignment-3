import { useRouter } from "next/navigation";
import { HomeIcon } from "lucide-react";

import SidebarOtherTopics from "@/components/navigation/sidebar/sidebar-other-topics";

import SidebarItemWithIcon from "./sidebar-item-with-icon";

/* Assumption: This component is only rendered if the user is logged in */
const Sidebar = () => {
  const router = useRouter();
  return (
    <div className="sticky flex flex-col h-[calc(100vh_-_72px)] w-full px-4 py-6 bg-primary-100/20 space-y-6">
      <div className="flex flex-col space-y-2.5 w-full max-w-xs">
        {/* TODO: active category */}
        <SidebarItemWithIcon
          Icon={HomeIcon}
          label="Home"
          onClick={() => router.push("/")}
        />
      </div>
      <SidebarOtherTopics />
    </div>
  );
};

export default Sidebar;
