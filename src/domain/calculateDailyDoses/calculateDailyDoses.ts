import type { QuestionnaireAnswers } from "../types";

/**
 * Calculates the base dose for each day of the prescription, before
 * availability and bank holidays redistribute collections.
 * Titration prescriptions hold the initial dose for days 1 to N and
 * step by the dose change every N days after that.
 * @param answers - the validated questionnaire answers
 * @param duration - the number of days the prescription covers
 * @returns one dose in ml per day, in day order
 */
export const calculateDailyDoses = (
  answers: QuestionnaireAnswers,
  duration: number,
) => {
  return Array.from({ length: duration }, (_, index) => {
    if (answers.prescriptionType === "Stabilisation")
      return answers.stabilisationDose;

    //  Whole change periods completed by this day
    const stepsApplied = Math.floor(index / answers.changePeriod);

    if (answers.prescriptionType === "Increasing") {
      //  Clamp at the 60ml maximum; the schedule step warns the prescriber when this happens
      return Math.min(
        answers.initialDose + answers.doseChange * stepsApplied,
        60,
      );
    }

    //  A reducing prescription that reaches 0ml has completed its taper
    return Math.max(answers.initialDose - answers.doseChange * stepsApplied, 0);
  });
};
