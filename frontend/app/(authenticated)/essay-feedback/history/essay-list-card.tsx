"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Download,
  Ellipsis,
  Link2,
  MessageSquare,
  Plus,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";

const EssayListCard = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col w-full bg-card border px-4 py-4 rounded-sm text-pretty break-words">
      <div
        className="cursor-pointer"
        onClick={() => router.push("/essay-feedback/1")}
      >
        <h1 className="text-text font-medium text-lg">
          Is our pursuit of beauty justifiable?
        </h1>
        <p className="text-text-muted line-clamp-4 text-pretty break-words mt-2">
          Since time immemorial, the human race has had an inexplicable, yet
          innate desire for beauty and aesthetic perfection. While notions of
          beauty have changed overtime, our desire for it has not waned, and in
          fact has arguably gotten more ferventin a world pervaded by social
          media and idealised beauty standards. In this light,the human pursuit
          of beauty, especially that of physical beauty, seems to havegained a
          bad reputation, perpetuating unrealistic standards and leading to
          negativeimpacts on self-worth, especially for teenagers. However, if
          we expand ourhorizons, we may realise that beauty is present in
          everything, across spheres ofsport, art and music, and that our
          pursuit of beauty not only has positive impactson character, but is
          also innate to us humans, and can serve real purposes incommunities.
          Given this renewed understanding, our pursuit of beauty is not
          onlyjustified, but also vital to human survival and development.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex items-center w-full justify-between text-gray-400">
        <div className="flex items-center gap-x-4">
          <span className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-1.5" />
            <span>2 Oct 24</span>
          </span>
          <span className="flex items-center text-sm">
            <MessageSquare className="w-4 h-4 mr-1.5" />
            <span>3 comments</span>
          </span>
        </div>
        <span>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis className="w-4 h-4 mr-1.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-1.5" /> Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link2 className="w-4 h-4 mr-1.5" /> Copy link
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/5">
                  <Trash className="w-4 h-4 mr-1.5" /> Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
      </div>
    </div>
  );
};

export default EssayListCard;
