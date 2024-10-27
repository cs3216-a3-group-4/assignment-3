import { format } from "date-fns";

export const parseDate = (date: string | Date | number): string => {
  const PLACEHOLDER_DATE = "-";
  try {
    return format(date, "d MMM yyyy");
  } catch {
    return PLACEHOLDER_DATE;
  }
};

export const parseDateNoYear = (date: string | Date | number): string => {
  const PLACEHOLDER_DATE = "-";
  try {
    return format(date, "d MMM");
  } catch {
    return PLACEHOLDER_DATE;
  }
};

export const toQueryDate = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};
