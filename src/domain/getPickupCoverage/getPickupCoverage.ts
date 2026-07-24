import type { ScheduleDay } from "../types";

export interface PickupCoverage {
  days: number;
  endDate: string;
  /** the dose of each covered day, in day order */
  doses: number[];
}

/**
 * Works out how many days a pick-up covers: its own day plus the run of
 * 0ml days after it, whose doses were rolled back onto it.
 * @param schedule - the distributed schedule, one entry per day
 * @param index - the position of the pick-up day in the schedule
 * @returns the day count and the last date covered, or null when the
 * day has no pick-up
 */
export const getPickupCoverage = (
  schedule: ScheduleDay[],
  index: number,
): PickupCoverage | null => {
  if (schedule[index].pickup === 0) return null;

  let days = 1;
  while (
    index + days < schedule.length &&
    schedule[index + days].pickup === 0
  ) {
    days += 1;
  }

  return {
    days,
    endDate: schedule[index + days - 1].date,
    doses: schedule.slice(index, index + days).map((day) => day.dose),
  };
};
