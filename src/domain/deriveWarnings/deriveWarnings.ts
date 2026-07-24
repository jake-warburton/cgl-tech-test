import type {
  QuestionnaireAnswers,
  ScheduleDay,
  ScheduleWarning,
} from "../types";

interface DeriveWarningsArgs {
  schedule: ScheduleDay[];
  answers: QuestionnaireAnswers;
}

//  The story describes 2 to 3 pharmacy visits a week as typical, so a
//  single pick-up covering up to 4 days is normal; anything above that
//  is flagged for a staff member to confirm
const MAX_TYPICAL_PICKUP_DAYS = 4;

/**
 * Derives safety warnings from a generated schedule. Warnings never
 * block the schedule: we calculate, the prescriber decides.
 * @param schedule - the distributed schedule, one entry per day
 * @param answers  - the answers to the questionnaire determine prescription type and dose increase/reduction
 * @returns a warning per finding; empty when nothing needs attention
 */
export const deriveWarnings = ({
  schedule,
  answers,
}: DeriveWarningsArgs): ScheduleWarning[] => {
  const warnings: ScheduleWarning[] = [];

  if (answers.prescriptionType === "Increasing") {
    const { initialDose, doseChange, changePeriod } = answers;

    const cappedIndex = schedule.findIndex(
      (_, index) =>
        initialDose + doseChange * Math.floor(index / changePeriod) > 60,
    );

    if (cappedIndex !== -1) {
      warnings.push({
        type: "dose-capped",
        date: schedule[cappedIndex].date,
        message: `The dose reaches the 60ml maximum on ${schedule[cappedIndex].date} and has been capped. Confirm the prescription with the prescriber.`,
      });
    }
  }

  schedule.forEach((day, index) => {
    if (day.pickup === 0) return;

    //  A pick-up covers its own day plus the run of 0ml days after it,
    //  whose doses were rolled back onto it. Leading 0ml days (the
    //  roll-forward edge case) are undercounted here, which errs
    //  towards silence; that state raises its own warning instead
    let daysCovered = 1;
    while (
      index + daysCovered < schedule.length &&
      schedule[index + daysCovered].pickup === 0
    ) {
      daysCovered += 1;
    }

    if (daysCovered > MAX_TYPICAL_PICKUP_DAYS) {
      warnings.push({
        type: "large-pickup",
        date: day.date,
        message: `The pick-up on ${day.date} covers ${daysCovered} days of medication. Confirm this is appropriate before issuing.`,
      });
    }
  });

  return warnings;
};
