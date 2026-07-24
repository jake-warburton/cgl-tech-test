import { describe, expect, it } from "vitest";

import { getNextCollectableDate } from "./getNextCollectableDate";

describe("getNextCollectableDate", () => {
  it("returns the given date when it is already collectable", () => {
    // 2026-08-03 is a Monday
    expect(
      getNextCollectableDate({
        from: "2026-08-03",
        availableDays: ["Monday"],
        bankHolidays: [],
      }),
    ).toBe("2026-08-03");
  });

  it("walks forward to the next available weekday", () => {
    // from Saturday, the next available Monday is the 10th
    expect(
      getNextCollectableDate({
        from: "2026-08-08",
        availableDays: ["Monday"],
        bankHolidays: [],
      }),
    ).toBe("2026-08-10");
  });

  it("skips bank holidays when walking forward", () => {
    // the August bank holiday Monday rolls the answer a week onward
    expect(
      getNextCollectableDate({
        from: "2026-08-29",
        availableDays: ["Monday"],
        bankHolidays: ["2026-08-31"],
      }),
    ).toBe("2026-09-07");
  });

  it("returns null when no collectable day exists within a year", () => {
    expect(
      getNextCollectableDate({
        from: "2026-08-03",
        availableDays: [],
        bankHolidays: [],
      }),
    ).toBeNull();
  });
});
