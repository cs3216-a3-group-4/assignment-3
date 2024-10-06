import { ChevronDown } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const enum Filter {
    CATEGORY = "Category",
    DATE = "Date Added",
};

type Props = {
    filter: string;
    setFilter: Dispatch<SetStateAction<string>>;
};

const NotesSelector = ({filter, setFilter}: Props) => {

    const handleSelect = (selectedFilter: Filter) => {
        if (filter != selectedFilter) {
          // Update the text
          setFilter(selectedFilter);
        }
        // Close dropdown
    };

    return (
        <div className="flex justify-center self-center grow-0">
            <DropdownMenu>
                {/* Trigger: button with the selected option displayed */}
                <DropdownMenuTrigger asChild>
                <button className="flex p-2 gap-1 rounded-md hover:bg-muted-foreground/10">
                    {filter} <ChevronDown className="w-4 h-4 self-center" />
                </button>
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
