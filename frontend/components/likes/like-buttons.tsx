import { LucideThumbsDown, LucideThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  onLike: () => void;
  onDislike: () => void;
  userLikeValue: 0 | 1 | -1;
}

function LikeButtons({ onLike, onDislike, userLikeValue }: Props) {
  return (
    <div className="flex gap-6 items-center mt-4">
      <p className="text-slate-600">Is this helpful?</p>
      <div className="flex gap-1 items-center">
        <Button onClick={onLike} size={"icon"} variant={"ghost"}>
          <LucideThumbsUp
            className={cn("stroke-slate-600", {
              "fill-cyan-200": userLikeValue === 1,
            })}
          />
        </Button>
        <Button onClick={onDislike} size={"icon"} variant={"ghost"}>
          <LucideThumbsDown
            className={cn("stroke-slate-600", {
              "fill-cyan-200": userLikeValue === -1,
            })}
          />
        </Button>
      </div>
    </div>
  );
}

export default LikeButtons;
