import { format, parseISO } from "date-fns";
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
  //  parseISO reads a date-only string as local midnight, matching how
  //  format renders it; format(string) would parse as UTC midnight and
  //  shift the weekday on machines west of UTC
  availableDays.includes(format(parseISO(date), "eeee") as DayOfWeek) &&
  !bankHolidays.includes(date);
