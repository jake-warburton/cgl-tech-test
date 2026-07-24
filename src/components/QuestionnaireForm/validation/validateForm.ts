import type { FormErrors, FormValues } from "../types";
import { isValidChangePeriod } from "./isValidChangePeriod";
import { isValidDose } from "./isValidDose";

/**
 * Validates the questionnaire values, applying only the rules
 * relevant to the selected prescription type.
 * @param values - the raw form values, excluding country
 * @returns an error message per invalid field; empty when the form is valid
 */
export const validateForm = (
  values: Omit<FormValues, "country">,
): FormErrors => {
  const errors: FormErrors = {};

  if (!values.availableDays.length) {
    errors.availableDays =
      "Select at least one day the service user is available";
  }

  if (values.prescriptionType === "") {
    errors.prescriptionType = "Select a prescription type";
  }

  if (
    values.prescriptionType === "Stabilisation" &&
    !isValidDose(values.stabilisationDose)
  ) {
    errors.stabilisationDose = "Dosage must be a whole number between 0 and 60";
  }

  if (
    values.prescriptionType === "Reducing" ||
    values.prescriptionType === "Increasing"
  ) {
    if (!isValidDose(values.initialDose)) {
      errors.initialDose =
        "Initial Daily Dose (ml) must be a whole number between 0 and 60";
    }

    if (!isValidDose(values.doseChange)) {
      errors.doseChange =
        "Increase/Decrease (ml) must be a whole number between 0 and 60";
    }

    if (!isValidChangePeriod(values.changePeriod)) {
      errors.changePeriod = "Every (days) must be a whole number of 1 or more";
    }
  }

  return errors;
};
