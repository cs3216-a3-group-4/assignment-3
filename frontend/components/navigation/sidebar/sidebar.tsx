import UserProfileButton from "@/components/auth/user-profile-button";
import SidebarOtherTopics from "@/components/navigation/sidebar/sidebar-other-topics";

/* Assumption: This component is only rendered if the user is logged in */
const Sidebar = () => {
  return (
    <div className="sticky flex flex-col h-[calc(100vh_-_72px)] w-full px-4 py-4 bg-muted/40 space-y-6">
      <UserProfileButton />
      <SidebarOtherTopics />
    </div>
  );
};

export default Sidebar;
