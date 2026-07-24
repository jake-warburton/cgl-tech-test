import { format } from "date-fns";
import type { DayOfWeek } from "../types";

interface IsCollectableArgs {
  date: string;
  availableDays: DayOfWeek[];
  bankHolidays: string[];
}

export const isCollectable = ({
  date,
  availableDays,
  bankHolidays,
}: IsCollectableArgs): boolean =>
  availableDays.includes(format(date, "eeee") as DayOfWeek) &&
  !bankHolidays.includes(date);
