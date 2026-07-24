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
