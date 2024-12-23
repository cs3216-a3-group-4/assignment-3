import { Dispatch, SetStateAction } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const enum Filter {
  CATEGORY = "Category",
  DATE = "Date Added",
}

type Props = {
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
};

const NotesSelector = ({ filter, setFilter }: Props) => {
  const handleSelect = (selectedFilter: Filter) => {
    if (filter != selectedFilter) {
      // Update the text
      setFilter(selectedFilter);
    }
    // Close dropdown
  };

  return (
    <div className="flex justify-center w-fit max-w-full">
      <DropdownMenu>
        {/* Trigger: button with the selected option displayed */}
        <DropdownMenuTrigger asChild>
          <div>
            <div className="hidden sm:block">
              <Button
                className="flex p-2 gap-1 rounded-md"
                size="lg"
                variant="ghost"
              >
                {filter} <ChevronDown className="w-4 h-4 self-center" />
              </Button>
            </div>
            <div className="sm:hidden">
              <Button
                className="flex p-2 gap-1 rounded-md"
                size="sm"
                variant="ghost"
              >
                {filter} <ChevronDown className="w-4 h-4 self-center" />
              </Button>
            </div>
          </div>
        </DropdownMenuTrigger>

        {/* Menu content */}
        <DropdownMenuContent className="p-2 border rounded-md shadow-md">
          {/* Menu options */}
          <DropdownMenuItem onClick={() => handleSelect(Filter.CATEGORY)}>
            {Filter.CATEGORY}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSelect(Filter.DATE)}>
            {Filter.DATE}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotesSelector;
