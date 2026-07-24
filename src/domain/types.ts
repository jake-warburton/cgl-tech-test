export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type PrescriptionType = "Reducing" | "Increasing" | "Stabilisation";

type BaseAnswers = {
  country: string;
  availableDays: DayOfWeek[];
  startDate: string;
};

export interface ScheduleDay {
  date: string;
  dose: number;
  pickup: number;
  isBankHoliday: boolean;
}

export interface ScheduleWarning {
  type: "large-pickup" | "dose-capped";
  date?: string;
  message: string;
}

export type QuestionnaireAnswers =
  | (BaseAnswers & {
      prescriptionType: "Stabilisation";
      stabilisationDose: number;
    })
  | (BaseAnswers & {
      prescriptionType: "Reducing" | "Increasing";
      initialDose: number;
      doseChange: number;
      changePeriod: number;
    });
