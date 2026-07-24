import { describe, expect, it } from "vitest";

import { isValidDose } from "./isValidDose";

describe("isValidDose", () => {
  it.each(["0", "30", "60"])("accepts the whole number %s", (value) => {
    expect(isValidDose(value)).toBe(true);
  });

  it.each([
    ["61", "above the maximum"],
    ["-1", "below the minimum"],
    ["0.5", "fractional"],
    ["", "empty"],
    ["abc", "not a number"],
  ])("rejects '%s' (%s)", (value) => {
    expect(isValidDose(value)).toBe(false);
  });
});
