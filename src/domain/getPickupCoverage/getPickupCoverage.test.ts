import { describe, expect, it } from "vitest";

import type { ScheduleDay } from "../types";
import { getPickupCoverage } from "./getPickupCoverage";

const day = (date: string, dose: number, pickup: number): ScheduleDay => ({
  date,
  dose,
  pickup,
  isBankHoliday: false,
});

const schedule = [
  day("2026-08-24", 60, 120),
  day("2026-08-25", 60, 0),
  day("2026-08-26", 60, 60),
  day("2026-08-27", 60, 180),
  day("2026-08-28", 60, 0),
  day("2026-08-29", 60, 0),
];

describe("getPickupCoverage", () => {
  it("covers the pick-up day plus the 0ml days that follow it", () => {
    expect(getPickupCoverage(schedule, 3)).toEqual({
      days: 3,
      endDate: "2026-08-29",
      doses: [60, 60, 60],
    });
  });

  it("covers a single day when the next day has its own pick-up", () => {
    expect(getPickupCoverage(schedule, 2)).toEqual({
      days: 1,
      endDate: "2026-08-26",
      doses: [60],
    });
  });

  it("does not attribute a following pick-up's days to the previous one", () => {
    expect(getPickupCoverage(schedule, 0)).toEqual({
      days: 2,
      endDate: "2026-08-25",
      doses: [60, 60],
    });
  });

  it("returns null for a day with no pick-up", () => {
    expect(getPickupCoverage(schedule, 1)).toBeNull();
  });

  it("does not count collectable 0ml taper days as covered by an earlier pick-up", () => {
    //  A 1ml prescription reducing by 1ml daily completes its taper after
    //  day one; the days after are collectable but have nothing to collect,
    //  so they are not covered by the first pick-up
    const taperSchedule = [
      day("2026-08-03", 1, 1),
      day("2026-08-04", 0, 0),
      day("2026-08-05", 0, 0),
      day("2026-08-06", 0, 0),
      day("2026-08-07", 0, 0),
      day("2026-08-08", 0, 0),
    ];

    expect(getPickupCoverage(taperSchedule, 0)).toEqual({
      days: 1,
      endDate: "2026-08-03",
      doses: [1],
    });
  });
});
