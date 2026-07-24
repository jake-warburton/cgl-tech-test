import { buildDateRange } from "../buildDateRange/buildDateRange";
import { isCollectable } from "../isCollectable/isCollectable";
import type { DayOfWeek } from "../types";

interface GetNextCollectableDateArgs {
  fromDate: string;
  availableDays: DayOfWeek[];
  bankHolidays: string[];
}

export const getNextCollectableDate = ({
  fromDate,
  availableDays,
  bankHolidays,
}: GetNextCollectableDateArgs): string | null => {
  //  Find the next collectible date in the next year from date
  for (const date of buildDateRange(fromDate, 365)) {
    if (isCollectable({ date, availableDays, bankHolidays })) return date;
  }

  return null;
};
