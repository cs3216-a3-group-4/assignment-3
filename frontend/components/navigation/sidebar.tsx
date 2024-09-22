import UserProfileButton from "@/components/auth/user-profile-button";
import { useUserStore } from "@/store/user/user-store-provider";

const Sidebar = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  return (
    <div className="sticky flex flex-col md:w-3/12 h-[calc(100vh_-_72px)] px-8 py-8 max-w-80 bg-muted/40 border-r-[1px] border-border/40">
      {isLoggedIn && <UserProfileButton />}
    </div>
  );
};

export default Sidebar;
