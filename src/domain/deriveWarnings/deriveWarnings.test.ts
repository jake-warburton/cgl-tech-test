import { describe, expect, it } from "vitest";

import type { QuestionnaireAnswers } from "../types";
import { deriveWarnings } from "./deriveWarnings";

const day = (date: string, dose: number, pickup: number) => ({
  date,
  dose,
  pickup,
  isBankHoliday: false,
});

const stabilisationAnswers: QuestionnaireAnswers = {
  country: "england-and-wales",
  startDate: "2026-08-24",
  availableDays: ["Monday", "Wednesday", "Friday"],
  prescriptionType: "Stabilisation",
  stabilisationDose: 60,
};

const reducingAnswers: QuestionnaireAnswers = {
  country: "england-and-wales",
  startDate: "2026-08-24",
  availableDays: ["Monday", "Wednesday", "Friday"],
  prescriptionType: "Reducing",
  initialDose: 60,
  doseChange: 5,
  changePeriod: 7,
};

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

    expect(deriveWarnings({ schedule, answers: stabilisationAnswers })).toEqual(
      [],
    );
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

    expect(deriveWarnings({ schedule, answers: reducingAnswers })).toEqual([
      {
        type: "large-pickup",
        date: "2026-08-28",
        message:
          "The pick-up on 2026-08-28 covers 5 days of medication. Confirm this is appropriate before issuing.",
      },
    ]);
  });

  it("does not warn when a completed taper leaves collectable 0ml days", () => {
    //  A 1ml prescription reducing by 1ml daily: the taper completes after
    //  day one, so the 0ml days that follow are collectable days with
    //  nothing to collect, not days covered by a large first pick-up
    const taperAnswers: QuestionnaireAnswers = {
      country: "england-and-wales",
      startDate: "2026-08-03",
      availableDays: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      prescriptionType: "Reducing",
      initialDose: 1,
      doseChange: 1,
      changePeriod: 1,
    };
    const schedule = [
      day("2026-08-03", 1, 1),
      day("2026-08-04", 0, 0),
      day("2026-08-05", 0, 0),
      day("2026-08-06", 0, 0),
      day("2026-08-07", 0, 0),
      day("2026-08-08", 0, 0),
    ];

    expect(deriveWarnings({ schedule, answers: taperAnswers })).toEqual([]);
  });

  it("warns when an increasing prescription has been capped at 60ml", () => {
    // 55ml increasing by 4ml every 2 days would reach 63ml on the fifth
    // day; the dose calculation caps it at 60ml instead
    const increasingAnswers: QuestionnaireAnswers = {
      country: "england-and-wales",
      startDate: "2026-08-24",
      availableDays: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      prescriptionType: "Increasing",
      initialDose: 55,
      doseChange: 4,
      changePeriod: 2,
    };
    const schedule = [
      day("2026-08-03", 55, 55),
      day("2026-08-04", 55, 55),
      day("2026-08-05", 59, 59),
      day("2026-08-06", 59, 59),
      day("2026-08-07", 60, 60),
      day("2026-08-08", 60, 60),
    ];

    expect(deriveWarnings({ schedule, answers: increasingAnswers })).toEqual([
      {
        type: "dose-capped",
        date: "2026-08-07",
        message:
          "The dose reaches the 60ml maximum on 2026-08-07 and has been capped. Confirm the prescription with the prescriber.",
      },
    ]);
  });
});
