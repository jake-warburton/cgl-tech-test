import type { DayOfWeek, ScheduleDay } from "../types";
import { isCollectable } from "../isCollectable/isCollectable";
import { getNextCollectableDate } from "../getNextCollectableDate/getNextCollectableDate";

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
  const pickupsArray: ScheduleDay[] = [];

  let accumulatedDosage = 0;

  for (let i = dates.length - 1; i > -1; i -= 1) {
    const isCollectableToday = isCollectable({
      date: dates[i],
      availableDays,
      bankHolidays,
    });

    //  Add today's dose to the pickup amount
    accumulatedDosage += doses[i];

    const dosageToPickupToday = isCollectableToday ? accumulatedDosage : 0;

    //  Service user picks up today. Reset accumulator back to 0 for tomorrow
    if (isCollectableToday) accumulatedDosage = 0;

    pickupsArray.push({
      date: dates[i],
      dose: doses[i],
      pickup: dosageToPickupToday,
    });
  }

  //    Reverse the array since we worked backwards through it to make accumulation easier
  //    If the next block is hit, we want that to see the first pickup day
  const schedule = pickupsArray.reverse();

  if (accumulatedDosage > 0) {
    //  There are some doses near the start without a collection day,
    //  This shouldn't happen in practice because we don't
    //  allow them to start the prescription on a non-collection day in the UI

    const firstCollectableDay = getNextCollectableDate({
      fromDate: schedule[0].date,
      availableDays,
      bankHolidays,
    });

    const firstCollectableIndex = schedule.findIndex(
      (day) => day.date === firstCollectableDay,
    );

    if (firstCollectableIndex !== -1)
      schedule[firstCollectableIndex].pickup += accumulatedDosage;
  }

  return schedule;
};
