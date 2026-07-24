import { describe, expect, it } from "vitest";

import { isValidChangePeriod } from "./isValidChangePeriod";

describe("isValidChangePeriod", () => {
  it.each(["1", "3", "14"])("accepts the whole number %s", (value) => {
    expect(isValidChangePeriod(value)).toBe(true);
  });

  it.each([
    ["0", "below the minimum"],
    ["-3", "negative"],
    ["0.5", "fractional"],
    ["", "empty"],
    ["abc", "not a number"],
  ])("rejects '%s' (%s)", (value) => {
    expect(isValidChangePeriod(value)).toBe(false);
  });
});
