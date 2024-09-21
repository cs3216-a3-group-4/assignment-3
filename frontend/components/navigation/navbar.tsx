import { useEffect } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import { useQuery } from "@tanstack/react-query";

import UserProfileButton from "@/components/auth/user-profile-button";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { getUserProfile } from "@/queries/user";
import { useUserStore } from "@/store/user/user-store-provider";
import { NavItem } from "@/types/navigation";

export const NavItems: NavItem[] = [];

function Navbar() {
  const { isLoggedIn, setLoggedIn, setNotLoggedIn } = useUserStore(
    (state) => state,
  );
  const { data: userProfile, isSuccess: isUserProfileSuccess } =
    useQuery(getUserProfile());

  useEffect(() => {
    if (isUserProfileSuccess && userProfile) {
      setLoggedIn(userProfile.id, userProfile.email);
    } else {
      setNotLoggedIn();
    }
  }, [userProfile, isUserProfileSuccess, setLoggedIn, setNotLoggedIn]);

  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b-2">
      <div className="w-full flex items-center justify-between px-4 py-4 sm:px-8 sm:py-4 md:px-20">
        <div className="flex items-center">
          <Link className="mr-6 flex items-center gap-x-2" href="/">
            <span className="inline-block font-bold">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {NavItems.map((navItem) => (
                <NavigationMenuItem key={navItem.label}>
                  <Link href={navItem.path} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {navItem.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {isLoggedIn && <UserProfileButton />}
      </div>
    </header>
  );
}

export default Navbar;
