export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type PrescriptionType = "Reducing" | "Increasing" | "Stabilisation";

export interface FormValues {
  country: string;
  availableDays: DayOfWeek[];
  prescriptionType: PrescriptionType | "";
  stabilisationDose: string;
  initialDose: string;
  doseChange: string;
  changePeriod: string;
}

type FormField =
  | "availableDays"
  | "prescriptionType"
  | "stabilisationDose"
  | "initialDose"
  | "doseChange"
  | "changePeriod";

export type FormErrors = Partial<Record<FormField, string>>;

type BaseAnswers = {
  country: string;
  availableDays: DayOfWeek[];
};

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
