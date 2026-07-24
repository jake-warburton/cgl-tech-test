import type { DayOfWeek, PrescriptionType } from "../../domain/types";

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
