import { addDays, eachDayOfInterval, format, parseISO } from "date-fns";

export const buildDateRange = (startDate: string, totalDays: number) => {
  const start = parseISO(startDate);

  return eachDayOfInterval({
    start,
    end: addDays(start, totalDays - 1),
  }).map((date) => format(date, "yyyy-MM-dd"));
};
