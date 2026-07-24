import type { DayOfWeek } from "../types";

interface DistributePickupsArgs {
  dates: string[];
  doses: number[];
  availableDays: DayOfWeek[];
  bankHolidays: string[];
}

export const distributePickups = ({
  dates,
  doses,
  availableDays,
  bankHolidays,
}: DistributePickupsArgs) =>
  dates.map((date, i) => ({
    date,
    dose: doses[i],
    pickup: doses[i],
  }));
