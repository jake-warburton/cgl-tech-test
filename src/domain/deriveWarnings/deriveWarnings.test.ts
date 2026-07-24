import { describe, expect, it } from "vitest";

import { deriveWarnings } from "./deriveWarnings";

const day = (date: string, dose: number, pickup: number) => ({
  date,
  dose,
  pickup,
});

describe("deriveWarnings", () => {
  it("returns no warnings for a typical schedule", () => {
    // Mon/Wed/Fri pattern: no pickup covers more than 3 days
    const schedule = [
      day("2026-08-03", 60, 120),
      day("2026-08-04", 60, 0),
      day("2026-08-05", 60, 120),
      day("2026-08-06", 60, 0),
      day("2026-08-07", 60, 180),
      day("2026-08-08", 60, 0),
      day("2026-08-09", 60, 0),
    ];

    expect(deriveWarnings({ schedule })).toEqual([]);
  });

  it("warns when a single pickup covers more than four days", () => {
    // the reference schedule's 290ml Friday covers five days
    const schedule = [
      day("2026-08-28", 60, 290),
      day("2026-08-29", 60, 0),
      day("2026-08-30", 60, 0),
      day("2026-08-31", 55, 0),
      day("2026-09-01", 55, 0),
      day("2026-09-02", 55, 55),
    ];

    expect(deriveWarnings({ schedule })).toEqual([
      {
        type: "large-pickup",
        date: "2026-08-28",
        message:
          "The pick-up on 2026-08-28 covers 5 days of medication. Confirm this is appropriate before issuing.",
      },
    ]);
  });
});
