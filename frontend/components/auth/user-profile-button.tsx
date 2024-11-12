"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCardIcon, LogOutIcon, UserIcon } from "lucide-react";

import { logoutAuthLogoutGet } from "@/client";
import Chip from "@/components/display/chip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/user/user-store-provider";
import { tierIDToTierName } from "@/types/billing";
import { getInitialFromEmail } from "@/utils/string";

const UserProfileButton = () => {
  const router = useRouter();
  const { user, setNotLoggedIn } = useUserStore((state) => state);

  const signout = async () => {
    await logoutAuthLogoutGet({ withCredentials: true });
    setNotLoggedIn();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex items-center w-full max-w-64 rounded p-4 hover:bg-muted-foreground/5">
        <div className="flex gap-x-6 items-center w-full">
          <Skeleton className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-[#e7e9e7]/80" />
          <div className="flex flex-col space-y-2 w-full">
            <Skeleton className="flex h-3 w-full shrink-0 overflow-hidden rounded-sm bg-[#e7e9e7]/80" />
            <Skeleton className="flex h-3 w-full shrink-0 overflow-hidden rounded-sm bg-[#e7e9e7]/80" />
          </div>
        </div>
      </div>
    );
  }

  const email = user.email;
  const image_url = user.image_url;
  return (
    <div className="cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center w-full max-w-64 rounded-full p-2 hover:bg-muted-foreground/10">
            <Avatar className="h-9 w-9">
              {image_url && (
                <AvatarImage
                  alt={email}
                  className="rounded-full shadow-inner border-primary/80 object-cover"
                  referrerPolicy="no-referrer"
                  src={image_url}
                />
              )}
              <AvatarFallback>{getInitialFromEmail(email)}</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel className="flex flex-col gap-y-1">
            <span>My account</span>
            <span className="text-text-muted/80 font-normal text-sm">
              {email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/user/profile">
              <DropdownMenuItem>
                <UserIcon className="mr-2" size={16} />
                <span>Profile settings</span>
              </DropdownMenuItem>
            </Link>
            <Link className="cursor-pointer" href="/user/billing">
              <DropdownMenuItem>
                <CreditCardIcon className="mr-2" size={16} />
                <span>Manage billings</span>
                <Chip
                  className="ml-4 hidden xl:inline-flex"
                  label={tierIDToTierName(user.tier_id || 1)}
                  size="sm"
                />
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              onClick={signout}
            >
              <LogOutIcon className="mr-2" size={16} />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfileButton;
