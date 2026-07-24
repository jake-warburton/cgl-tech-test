import { describe, expect, it } from "vitest";

import { getBankHolidayDates } from "./getBankHolidayDates";

describe("getBankHolidayDates", () => {
  it("returns the bank holiday dates for a country as yyyy-MM-dd strings", () => {
    const result = getBankHolidayDates("england-and-wales");

    expect(result).toContain("2026-08-31");
    result.forEach((date) => {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  it("returns the correct division's holidays for each country", () => {
    // 2 January is a Scottish bank holiday only; the August holiday
    // falls on the 3rd in Scotland but the 31st in England and Wales
    expect(getBankHolidayDates("scotland")).toContain("2026-01-02");
    expect(getBankHolidayDates("england-and-wales")).not.toContain(
      "2026-01-02",
    );
    expect(getBankHolidayDates("scotland")).not.toContain("2026-08-31");
  });

  it("throws for a country not present in the data", () => {
    expect(() => getBankHolidayDates("france")).toThrow(
      "No bank holiday data for country: france",
    );
  });
});
