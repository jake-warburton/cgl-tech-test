import { addDays, eachDayOfInterval, format, parseISO } from "date-fns";

/**
 * Builds an array of consecutive date strings based on a given start date and total days
 * @param startDate - The starting date of the range in "yyyy-MM-dd" format
 * @param totalDays - Number of days the range encompasses
 * @returns Array of date strings "yyyy-MM-dd" in that range, inclusive of the startDate
 */
export const buildDateRange = (startDate: string, totalDays: number) => {
  const start = parseISO(startDate);

  return eachDayOfInterval({
    start,
    end: addDays(start, totalDays - 1), // interval is inclusive of both ends, so a 14-day range ends 13 days after it starts
  }).map((date) => format(date, "yyyy-MM-dd"));
};
