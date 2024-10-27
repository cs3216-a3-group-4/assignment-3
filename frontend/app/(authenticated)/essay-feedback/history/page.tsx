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
import EssayListCard from "./essay-list-card";

const EssayFeedbackHistoryPage = () => {
  const numEssays = 1;
  return (
    <div className="w-full h-full flex flex-col overflow-y-auto bg-muted py-8  px-4 sm:px-8 md:px-12 xl:px-24">
      <span className="flex flex-col">
        <h1 className="text-2xl text-primary-800 font-semibold">My essays</h1>
        <div className="flex justify-between mt-2 items-center">
          <h2 className="text-primary-600">{numEssays} notes</h2>
          <Button size="sm" variant="ghost">
            New essay feedback <Plus className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </span>

      {numEssays === 0 ? (
        <div className="flex flex-col w-full text-text/80 bg-primary-100/80 px-4 py-4 mt-4 rounded-sm">
          <span className="font-[450]">No essays submitted yet</span>
        </div>
      ) : (
        <div className="flex flex-col w-full mt-4 gap-y-4">
          <EssayListCard />
          <EssayListCard />
          <EssayListCard />
        </div>
      )}
    </div>
  );
};

export default EssayFeedbackHistoryPage;
