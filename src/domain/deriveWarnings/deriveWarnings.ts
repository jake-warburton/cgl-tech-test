import { parseISO } from "date-fns";
import { getPickupCoverage } from "../getPickupCoverage/getPickupCoverage";
import type {
  QuestionnaireAnswers,
  ScheduleDay,
  ScheduleWarning,
} from "../types";

interface DeriveWarningsArgs {
  schedule: ScheduleDay[];
  answers: QuestionnaireAnswers;
  bankHolidays: string[];
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
 * @param bankHolidays - the known bank holidays as "yyyy-MM-dd" strings, injected so tests control the data boundary
 * @returns a warning per finding; empty when nothing needs attention
 */
export const deriveWarnings = ({
  schedule,
  answers,
  bankHolidays,
}: DeriveWarningsArgs): ScheduleWarning[] => {
  const warnings: ScheduleWarning[] = [];

  //  If the prescription extends beyond the last stored bank holiday date
  //  Warn that it is possible that there is a bank holiday during the prescription
  //  And that our data is potentially stale
  const lastKnownBankHoliday = bankHolidays[bankHolidays.length - 1];
  if (
    parseISO(schedule[schedule.length - 1].date) >
    parseISO(lastKnownBankHoliday)
  ) {
    warnings.push({
      type: "beyond-holiday-data",
      date: lastKnownBankHoliday,
      message: `The schedule extends beyond the bundled bank holiday data (last known holiday: ${lastKnownBankHoliday}). Closures after this date cannot be checked; confirm before issuing.`,
    });
  }

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
    const coverage = getPickupCoverage(schedule, index);
    if (!coverage) return;

    if (coverage.days > MAX_TYPICAL_PICKUP_DAYS) {
      warnings.push({
        type: "large-pickup",
        date: day.date,
        message: `The pick-up on ${day.date} covers ${coverage.days} days of medication. Confirm this is appropriate before issuing.`,
      });
    }
  });

  return warnings;
};
