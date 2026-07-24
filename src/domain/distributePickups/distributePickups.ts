import { format } from "date-fns";
import type { DayOfWeek } from "../types";

interface DistributePickupsArgs {
  dates: string[];
  doses: number[];
  availableDays: DayOfWeek[];
  bankHolidays: string[];
}

/**
 * Assigns each day's dose to a pick-up day. Doses for days the service
 * user cannot collect (unavailable weekdays or bank holidays) are added
 * to the previous collectable day's pick-up, and those days show a 0ml
 * pick-up. The dose field is unchanged: it is what is consumed that day.
 * @param dates - the schedule days as "yyyy-MM-dd" strings, in order
 * @param doses - one dose in ml per day, aligned with dates by index
 * @param availableDays - weekdays the service user can collect on
 * @param bankHolidays - bank holiday dates as "yyyy-MM-dd" strings
 * @returns one entry per day: date, dose consumed and pick-up amount
 */
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

    //  Find if current day is a collection day and NOT a bank holiday
    const isCollectableDay =
      availableDays.includes(currentDayOfWeek) &&
      !bankHolidays.includes(dates[i]);

    const dosageToPickupToday = isCollectableDay ? accumulatedDosage : 0;

    //  Service user picks up today. Reset accumulator back to 0 for tomorrow
    if (isCollectableDay) accumulatedDosage = 0;

    pickupsArray.push({
      date: dates[i],
      dose: doses[i],
      pickup: dosageToPickupToday,
    });
  }

  return pickupsArray.reverse();
};
