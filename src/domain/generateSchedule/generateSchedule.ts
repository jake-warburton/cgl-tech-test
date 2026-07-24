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

interface GenerateScheduleArgs {
  answers: QuestionnaireAnswers;
  startDate: string;
}

interface GenerateScheduleReturn {
  schedule: ScheduleDay[];
  warnings: ScheduleWarning[];
}

export const generateSchedule = ({
  answers,
  startDate,
}: GenerateScheduleArgs): GenerateScheduleReturn => {
  const schedule = distributePickups({
    dates: buildDateRange(startDate, PRESCRIPTION_LENGTH_DAYS),
    doses: calculateDailyDoses(answers, PRESCRIPTION_LENGTH_DAYS),
    availableDays: answers.availableDays,
    bankHolidays: getBankHolidayDates(answers.country),
  });

  return {
    schedule,
    warnings: deriveWarnings({ schedule, answers }),
  };
};
