import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";

import { siteConfig } from "@/config/site";
import { NavItem } from "@/types/navigation";

import { navigationMenuTriggerStyle } from "../ui/navigation-menu";

export const NavItems: NavItem[] = [];

function Navbar() {
  return (
    <header className="w-full sticky top-0 bg-background z-50 backdrop-opacity-80">
      <div className="container flex items-center justify-between px-8 py-4 md:px-20">
        <Link className="mr-6 flex items-center gap-x-2" href="/">
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            {NavItems.map((navItem) => (
              <NavigationMenuItem key={navItem.label}>
                <Link href={navItem.path} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {navItem.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}

export default Navbar;
