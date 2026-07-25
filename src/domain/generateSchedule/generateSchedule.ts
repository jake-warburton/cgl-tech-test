import { buildDateRange } from "../buildDateRange/buildDateRange";
import { calculateDailyDoses } from "../calculateDailyDoses/calculateDailyDoses";
import { PRESCRIPTION_LENGTH_DAYS } from "../constants";
import { deriveWarnings } from "../deriveWarnings/deriveWarnings";
import { distributePickups } from "../distributePickups/distributePickups";
import { getBankHolidayDates } from "../getBankHolidayDates/getBankHolidayDates";
import type {
  QuestionnaireAnswers,
  ScheduleDay,
  ScheduleWarning,
} from "../types";

export interface ScheduleResult {
  schedule: ScheduleDay[];
  warnings: ScheduleWarning[];
}

export const generateSchedule = (
  answers: QuestionnaireAnswers,
): ScheduleResult => {
  const bankHolidays = getBankHolidayDates(answers.country);

  const schedule = distributePickups({
    dates: buildDateRange(answers.startDate, PRESCRIPTION_LENGTH_DAYS),
    doses: calculateDailyDoses(answers, PRESCRIPTION_LENGTH_DAYS),
    availableDays: answers.availableDays,
    bankHolidays,
  });

  return {
    schedule,
    warnings: deriveWarnings({ schedule, answers, bankHolidays }),
  };
};
