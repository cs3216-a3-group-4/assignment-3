import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
}

const DateRangeSelector = ({ selectedPeriod }: DateRangeSelectorProps) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
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
    // Close dropdown
    setShowDropdown(false);
  };

  return (
    <div className="relative z-20 inline-block">
      <button
        className="flex items-center space-x-2 text-3xl 2xl:text-4xl font-bold hover:underline"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span className="text-2xl md:text-4xl 2xl:text-4xl font-bold text-primary-800">
          {getDisplayValueFor(selectedPeriod)}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>
      {showDropdown && (
        <div className="absolute mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => handleSelection(Period.Day)}
            >
              past day
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => handleSelection(Period.Week)}
            >
              week
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => handleSelection(Period.Month)}
            >
              month
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;
