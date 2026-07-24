import { describe, expect, it } from "vitest";

import type { QuestionnaireAnswers } from "../types";
import { generateSchedule } from "./generateSchedule";

const reducingAnswers: QuestionnaireAnswers = {
  country: "england-and-wales",
  startDate: "2026-08-24",
  availableDays: ["Monday", "Wednesday", "Friday"],
  prescriptionType: "Reducing",
  initialDose: 60,
  doseChange: 5,
  changePeriod: 7,
};

describe("generateSchedule", () => {
  it("generates the two-week reference schedule with its warnings", () => {
    // Reducing 60ml by 5ml every 7 days from Monday 2026-08-24,
    // available Mon/Wed/Fri; the real August bank holiday on Monday the
    // 31st cascades into a five-day pick-up on Friday the 28th
    const { schedule, warnings } = generateSchedule(reducingAnswers);

    expect(schedule).toHaveLength(14);
    expect(schedule[0]).toEqual({
      date: "2026-08-24",
      dose: 60,
      pickup: 120,
    });

    expect(schedule.map((day) => day.pickup)).toEqual([
      120, 0, 120, 0, 290, 0, 0, 0, 0, 110, 0, 165, 0, 0,
    ]);

    expect(warnings).toEqual([
      {
        type: "large-pickup",
        date: "2026-08-28",
        message:
          "The pick-up on 2026-08-28 covers 5 days of medication. Confirm this is appropriate before issuing.",
      },
    ]);
  });

  it("applies the selected country's bank holidays", () => {
    // The August 2026 bank holiday falls on the 3rd in Scotland, not the
    // 31st, so the same answers produce a different schedule there
    const { schedule } = generateSchedule({
      ...reducingAnswers,
      country: "scotland",
    });

    // Monday the 31st is collectable in Scotland
    expect(schedule.map((day) => day.pickup)).toEqual([
      120, 0, 120, 0, 180, 0, 0, 110, 0, 110, 0, 165, 0, 0,
    ]);
  });
});
