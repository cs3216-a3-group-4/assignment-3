"use client";

import UserProfileButton from "@/components/auth/user-profile-button";
import Link from "@/components/navigation/link";
import { Button } from "@/components/ui/button";
import JippyIconSm from "@/public/jippy-icon/jippy-icon-sm";
import JippyLogo from "@/public/jippy-logo/jippy-logo-sm";
import { useUserStore } from "@/store/user/user-store-provider";
import { NavItem } from "@/types/navigation";

import MobileSidebar from "./mobile-sidebar";

export const NavItems: NavItem[] = [];

function MobileNavbar() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  return (
    <header className="md:hidden sticky top-0 z-50 w-full border-border bg-primary/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 border-b-[1px] min-h-[84px] max-h-[84px]">
      <div className="w-full flex items-center justify-between px-8 py-4">
        <div className="flex items-center">
          <Link className="hidden sm:flex mr-6 items-center gap-x-2" href="/">
            <JippyLogo />
          </Link>
          {!isLoggedIn && (
            <Link className="flex sm:hidden mr-6 items-center gap-x-2" href="/">
              <JippyIconSm />
            </Link>
          )}
          <div className="flex flex-1 justify-center">
            {isLoggedIn && <MobileSidebar />}
          </div>
        </div>

        <div className="flex items-center gap-x-4 justify-end min-h-[52px] max-h-[52px] min-w-fit ml-8">
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

export default MobileNavbar;
