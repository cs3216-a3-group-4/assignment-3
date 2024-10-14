"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";

import UserProfileButton from "@/components/auth/user-profile-button";
import { NAVBAR_HEIGHT } from "@/components/layout/app-layout";
import Link from "@/components/navigation/link";
import { Button } from "@/components/ui/button";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import JippyLogo from "@/public/jippy-logo/jippy-logo-sm";
import { useUserStore } from "@/store/user/user-store-provider";
import { NavItem } from "@/types/navigation";

export const NavItems: NavItem[] = [];

function Navbar() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  return (
    <header
      className={`hidden md:flex sticky top-0 z-50 w-full ${isLoggedIn ? "bg-background/60 border-border" : "bg-muted/60 border-muted"} backdrop-blur-lg border-b-[1px] min-h-[${NAVBAR_HEIGHT}px] max-h-[${NAVBAR_HEIGHT}px]`}
    >
      <div className="w-full flex items-center justify-between px-8 py-4">
        <div className="flex items-center">
          <Link className="mr-6 flex items-center gap-x-2" href="/">
            <JippyLogo classname="hidden sm:flex" />
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
        <div className="flex flex-1 items-center gap-x-4 justify-end min-h-[52px] max-h-[52px]">
          {isLoggedIn !== undefined &&
            (isLoggedIn ? (
              <UserProfileButton />
            ) : (
              <nav className="flex items-center gap-x-4">
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
                <Link href="/login">
                  <Button size="sm" variant="outline">
                    Log in
                  </Button>
                </Link>
              </nav>
            ))}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
