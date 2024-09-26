import { format } from "date-fns";

export const parseDate = (date: string | Date | number): string => {
  const PLACEHOLDER_DATE = "-";
  try {
    return format(date, "d MMM yyyy");
  } catch {
    return PLACEHOLDER_DATE;
  }
};
