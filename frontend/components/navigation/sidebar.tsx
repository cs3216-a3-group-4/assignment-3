import UserProfileButton from "@/components/auth/user-profile-button";
import { useUserStore } from "@/store/user/user-store-provider";

const Sidebar = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  return (
    <div className="sticky flex flex-col h-[calc(100vh_-_72px)] w-full px-4 py-4 bg-muted/40">
      {isLoggedIn && <UserProfileButton />}
    </div>
  );
};

export default Sidebar;
