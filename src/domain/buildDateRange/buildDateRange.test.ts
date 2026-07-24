import { describe, expect, it } from "vitest";

import { buildDateRange } from "./buildDateRange";

describe("buildDateRange", () => {
  it("returns the requested number of days, starting on the start date", () => {
    const result = buildDateRange("2026-08-03", 14);

    expect(result).toHaveLength(14);
    expect(result[0]).toBe("2026-08-03");
  });

  it("returns consecutive calendar days in YYYY-MM-DD format", () => {
    expect(buildDateRange("2026-08-03", 5)).toEqual([
      "2026-08-03",
      "2026-08-04",
      "2026-08-05",
      "2026-08-06",
      "2026-08-07",
    ]);
  });

  it("crosses a month boundary", () => {
    expect(buildDateRange("2026-01-30", 4)).toEqual([
      "2026-01-30",
      "2026-01-31",
      "2026-02-01",
      "2026-02-02",
    ]);
  });

  it("crosses a year boundary", () => {
    expect(buildDateRange("2027-12-30", 4)).toEqual([
      "2027-12-30",
      "2027-12-31",
      "2028-01-01",
      "2028-01-02",
    ]);
  });

  it("includes 29 February in a leap year", () => {
    expect(buildDateRange("2028-02-27", 4)).toEqual([
      "2028-02-27",
      "2028-02-28",
      "2028-02-29",
      "2028-03-01",
    ]);
  });

  it("does not skip or repeat a day when clocks go forward (UK DST start)", () => {
    // UK clocks go forward on 2026-03-29: that day is 23 hours long,
    // so millisecond-based date arithmetic would drift here.
    expect(buildDateRange("2026-03-28", 4)).toEqual([
      "2026-03-28",
      "2026-03-29",
      "2026-03-30",
      "2026-03-31",
    ]);
  });

  it("does not skip or repeat a day when clocks go back (UK DST end)", () => {
    // UK clocks go back on 2026-10-25: that day is 25 hours long.
    expect(buildDateRange("2026-10-24", 4)).toEqual([
      "2026-10-24",
      "2026-10-25",
      "2026-10-26",
      "2026-10-27",
    ]);
  });
});
