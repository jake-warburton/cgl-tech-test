import { describe, expect, it } from "vitest";

import { distributePickups } from "./distributePickups";

describe("distributePickups", () => {
  it("collects every day's dose on the day when all days are collectable", () => {
    // 2026-08-03 is a Monday
    const result = distributePickups({
      dates: ["2026-08-03", "2026-08-04", "2026-08-05"],
      doses: [60, 60, 55],
      availableDays: ["Monday", "Tuesday", "Wednesday"],
      bankHolidays: [],
    });

    expect(result).toEqual([
      { date: "2026-08-03", dose: 60, pickup: 60 },
      { date: "2026-08-04", dose: 60, pickup: 60 },
      { date: "2026-08-05", dose: 55, pickup: 55 },
    ]);
  });

  it("rolls an unavailable day's dose back onto the previous collectable day", () => {
    // 2026-08-04 is a Tuesday and Tuesday is not available
    const result = distributePickups({
      dates: ["2026-08-03", "2026-08-04", "2026-08-05"],
      doses: [60, 60, 55],
      availableDays: ["Monday", "Wednesday"],
      bankHolidays: [],
    });

    expect(result).toEqual([
      { date: "2026-08-03", dose: 60, pickup: 120 },
      { date: "2026-08-04", dose: 60, pickup: 0 },
      { date: "2026-08-05", dose: 55, pickup: 55 },
    ]);
  });

  it("cascades consecutive unavailable days onto the last collectable day before them", () => {
    // 2026-08-07 is a Friday; the weekend is not available, so Saturday
    // and Sunday both roll back onto Friday
    const result = distributePickups({
      dates: ["2026-08-07", "2026-08-08", "2026-08-09", "2026-08-10"],
      doses: [60, 60, 60, 55],
      availableDays: ["Monday", "Friday"],
      bankHolidays: [],
    });

    expect(result).toEqual([
      { date: "2026-08-07", dose: 60, pickup: 180 },
      { date: "2026-08-08", dose: 60, pickup: 0 },
      { date: "2026-08-09", dose: 60, pickup: 0 },
      { date: "2026-08-10", dose: 55, pickup: 55 },
    ]);
  });

  it("treats a bank holiday as a non-collection day even when the weekday is available", () => {
    // 2026-08-31 is the August bank holiday Monday; Monday is available
    const result = distributePickups({
      dates: ["2026-08-28", "2026-08-29", "2026-08-30", "2026-08-31", "2026-09-01"],
      doses: [55, 55, 55, 55, 55],
      availableDays: ["Monday", "Tuesday", "Friday"],
      bankHolidays: ["2026-08-31"],
    });

    // Friday collects its own dose plus the weekend and the holiday Monday
    expect(result).toEqual([
      { date: "2026-08-28", dose: 55, pickup: 220 },
      { date: "2026-08-29", dose: 55, pickup: 0 },
      { date: "2026-08-30", dose: 55, pickup: 0 },
      { date: "2026-08-31", dose: 55, pickup: 0 },
      { date: "2026-09-01", dose: 55, pickup: 55 },
    ]);
  });

  it("rolls leading non-collectable days forward onto the first collectable day", () => {
    // 2026-08-02 is a Sunday and Sunday is not available: there is no
    // earlier day to roll back onto, so its dose is collected on the Monday
    const result = distributePickups({
      dates: ["2026-08-02", "2026-08-03", "2026-08-04"],
      doses: [60, 60, 60],
      availableDays: ["Monday", "Tuesday"],
      bankHolidays: [],
    });

    expect(result).toEqual([
      { date: "2026-08-02", dose: 60, pickup: 0 },
      { date: "2026-08-03", dose: 60, pickup: 120 },
      { date: "2026-08-04", dose: 60, pickup: 60 },
    ]);
  });
});
