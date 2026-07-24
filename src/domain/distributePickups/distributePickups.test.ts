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
});
