import { useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import { useQuery } from "@tanstack/react-query";

import JippyIcon from "@/assets/jippy-icon/jippy-icon-sm";
import JippyLogo from "@/assets/jippy-logo/jippy-logo-sm";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { getUserProfile } from "@/queries/user";
import { useUserStore } from "@/store/user/user-store-provider";
import { NavItem } from "@/types/navigation";
import { Button } from "../ui/button";
import Link from "./link";

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
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b-[1px]">
      <div className="w-full min-h-[72px] flex items-center justify-between px-8 py-4">
        <div className="flex items-center">
          <Link className="mr-6 flex items-center gap-x-2" href="/">
            <JippyLogo classname="hidden sm:flex" />
            <JippyIcon classname="sm:hidden" />
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
        {!isLoggedIn && (
          <div className="flex flex-1 items-center gap-x-4 justify-end">
            <nav className="flex items-center space-x-4">
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
              <Link href="/login">
                <Button size="sm" variant="outline">
                  Log in
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
