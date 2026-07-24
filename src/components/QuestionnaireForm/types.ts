import type { DayOfWeek, PrescriptionType } from "../../domain/types";

export interface FormValues {
  country: string;
  availableDays: DayOfWeek[];
  prescriptionType: PrescriptionType | "";
  startDate: string;
  stabilisationDose: string;
  initialDose: string;
  doseChange: string;
  changePeriod: string;
}

//  The form's fields are exactly the values it collects; country is
//  excluded because the select cannot hold an invalid value
type FormField = Exclude<keyof FormValues, "country">;

export type FormErrors = Partial<Record<FormField, string>>;
