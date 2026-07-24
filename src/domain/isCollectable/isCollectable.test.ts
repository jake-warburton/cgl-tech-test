import { describe, expect, it } from "vitest";

import { isCollectable } from "./isCollectable";

describe("isCollectable", () => {
  it("returns true for an available weekday that is not a bank holiday", () => {
    // 2026-08-03 is a Monday
    expect(
      isCollectable({
        date: "2026-08-03",
        availableDays: ["Monday"],
        bankHolidays: [],
      }),
    ).toBe(true);
  });

  it("returns false for a weekday the service user is not available on", () => {
    expect(
      isCollectable({
        date: "2026-08-04",
        availableDays: ["Monday"],
        bankHolidays: [],
      }),
    ).toBe(false);
  });

  it("returns false for a bank holiday even when the weekday is available", () => {
    // 2026-08-31 is the August bank holiday Monday in England and Wales
    expect(
      isCollectable({
        date: "2026-08-31",
        availableDays: ["Monday"],
        bankHolidays: ["2026-08-31"],
      }),
    ).toBe(false);
  });
});
