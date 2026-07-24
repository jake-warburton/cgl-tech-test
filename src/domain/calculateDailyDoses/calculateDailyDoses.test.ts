import { describe, expect, it } from "vitest";

import type { QuestionnaireAnswers } from "../types";
import { calculateDailyDoses } from "./calculateDailyDoses";

const stabilisationAnswers: QuestionnaireAnswers = {
  country: "england-and-wales",
  availableDays: ["Monday"],
  prescriptionType: "Stabilisation",
  stabilisationDose: 30,
};

const reducingAnswers: QuestionnaireAnswers = {
  country: "england-and-wales",
  availableDays: ["Monday"],
  prescriptionType: "Reducing",
  initialDose: 60,
  doseChange: 5,
  changePeriod: 7,
};

const increasingAnswers: QuestionnaireAnswers = {
  country: "england-and-wales",
  availableDays: ["Monday"],
  prescriptionType: "Increasing",
  initialDose: 20,
  doseChange: 4,
  changePeriod: 3,
};

describe("calculateDailyDoses", () => {
  it("returns the same dose for every day of a stabilisation prescription", () => {
    const result = calculateDailyDoses(stabilisationAnswers, 14);

    expect(result).toHaveLength(14);
    expect(result.every((dose) => dose === 30)).toBe(true);
  });

  it("keeps the initial dose for days 1 to N and applies the first change on day N+1", () => {
    const result = calculateDailyDoses(increasingAnswers, 4);

    // changePeriod 3: days 1-3 on the initial dose, day 4 is the first increase
    expect(result).toEqual([20, 20, 20, 24]);
  });

  it("steps a reducing prescription down by the dose change every change period", () => {
    const result = calculateDailyDoses(reducingAnswers, 14);

    expect(result).toEqual([
      60, 60, 60, 60, 60, 60, 60, 55, 55, 55, 55, 55, 55, 55,
    ]);
  });

  it("steps an increasing prescription up by the dose change every change period", () => {
    const result = calculateDailyDoses(increasingAnswers, 14);

    expect(result).toEqual([
      20, 20, 20, 24, 24, 24, 28, 28, 28, 32, 32, 32, 36, 36,
    ]);
  });

  it("floors a reducing prescription at 0ml once the taper completes", () => {
    const result = calculateDailyDoses(
      { ...reducingAnswers, initialDose: 10, doseChange: 4, changePeriod: 2 },
      10,
    );

    expect(result).toEqual([10, 10, 6, 6, 2, 2, 0, 0, 0, 0]);
  });

  it("caps an increasing prescription at 60ml", () => {
    const result = calculateDailyDoses(
      { ...increasingAnswers, initialDose: 55, doseChange: 4, changePeriod: 2 },
      6,
    );

    expect(result).toEqual([55, 55, 59, 59, 60, 60]);
  });
});
