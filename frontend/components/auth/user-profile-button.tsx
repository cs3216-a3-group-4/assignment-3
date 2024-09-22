import { createElement, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";

import { logoutAuthLogoutGet } from "@/client";
import Chip from "@/components/display/chip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/user/user-store-provider";
import { getInitialFromEmail, getNameFromEmail } from "@/utils/string";

const UserProfileButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { email, setNotLoggedIn } = useUserStore((state) => state);
  const router = useRouter();

  const signout = async () => {
    await logoutAuthLogoutGet({ withCredentials: true });
    setNotLoggedIn();
    router.push("/");
  };

  return (
    <div>
      <DropdownMenu onOpenChange={(isOpen) => setIsOpen(isOpen)}>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center w-full max-w-64 rounded">
            <div className="flex space-x-6">
              <Avatar>
                <AvatarFallback>{getInitialFromEmail(email)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-medium">{getNameFromEmail(email)}</p>
                <p className="text-xs text-muted-foreground">{email}</p>
              </div>
            </div>
            {createElement(isOpen ? ChevronsDownUpIcon : ChevronsUpDownIcon, {
              className: "h-4 w-4 ml-auto shrink-0 opacity-50",
            })}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[calc(25vw_-_4rem)] max-w-64">
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push("/user/profile")}>
              <UserIcon className="mr-2" size={16} />
              <span>Profile settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/user/profile")}>
              <CreditCardIcon className="mr-2" size={16} />
              <span>Manage billings</span>
              <Chip
                className="ml-4 hidden xl:inline-flex"
                label="Free tier"
                size="sm"
              />
            </DropdownMenuItem>
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
