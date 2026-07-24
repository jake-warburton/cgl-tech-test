import { format } from "date-fns";
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
}: DistributePickupsArgs) => {
  const pickupsArray = [];

  let accumulatedDosage = 0;

  for (let i = dates.length - 1; i > -1; i -= 1) {
    accumulatedDosage += doses[i];

    //  Get current date's day of week
    const currentDayOfWeek = format(dates[i], "eeee") as DayOfWeek;

    const dosageToPickupToday = availableDays.includes(currentDayOfWeek)
      ? accumulatedDosage
      : 0;

    //  Service user picks up today. Reset accumulator back to 0 for tomorrow
    if (dosageToPickupToday > 0) accumulatedDosage = 0;

    pickupsArray.push({
      date: dates[i],
      dose: doses[i],
      pickup: dosageToPickupToday,
    });
  }

  return pickupsArray.reverse();
};
