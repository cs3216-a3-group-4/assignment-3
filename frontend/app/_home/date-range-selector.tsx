import { ChevronDown } from "lucide-react";

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
import { useUpdateTopEventsPeriod } from "@/queries/user";
import { useUserStore } from "@/store/user/user-store-provider";

export const enum Period {
  Day = 1,
  Week = 7,
  Month = 30,
}

export const getDisplayValueFor = (period: Period) => {
  switch (period) {
    case Period.Day:
      return "past day";
    case Period.Month:
      return "month";
    case Period.Week:
    default:
      return "week";
  }
};

interface DateRangeSelectorProps {
  selectedPeriod: Period;
  clearFilter?: () => void;
  onFilter?: () => void;
  isFiltered?: boolean;
}

const DateRangeSelector = ({
  selectedPeriod,
  clearFilter,
  onFilter,
  isFiltered,
}: DateRangeSelectorProps) => {
  const updateTopEventsMutation = useUpdateTopEventsPeriod();
  const setLoggedIn = useUserStore((store) => store.setLoggedIn);

  // Handle the option selection and close dropdown
  const handleSelection = (period: Period) => {
    if (period != selectedPeriod) {
      // Update the text
      updateTopEventsMutation.mutate(
        {
          timePeriod: period,
        },
        { onSuccess: (data) => setLoggedIn(data.data!) },
      );
    }
    if (onFilter) {
      onFilter();
    }
  };

  return (
    <div className="relative z-20 inline-block">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center gap-x-2">
            <span className="text-2xl md:text-4xl 2xl:text-4xl font-bold text-primary-800">
              {isFiltered ? "" : getDisplayValueFor(selectedPeriod)}
            </span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="text-sm">Date filter</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleSelection(Period.Day)}>
              Past day
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSelection(Period.Week)}>
              Past week
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSelection(Period.Month)}>
              Past month
            </DropdownMenuItem>
          </DropdownMenuGroup>
          {clearFilter && (
            <>
              <Separator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={clearFilter}>
                  Clear date filter
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DateRangeSelector;
