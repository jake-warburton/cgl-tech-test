import { isCollectable } from "../../../domain/isCollectable/isCollectable";
import type { FormErrors, FormValues } from "../types";
import { isValidChangePeriod } from "./isValidChangePeriod";
import { isValidDose } from "./isValidDose";

/**
 * Validates the questionnaire values, applying only the rules
 * relevant to the selected prescription type.
 * @param values - the raw form values, excluding country, plus the
 * selected country's bank holidays for the start date check
 * @returns an error message per invalid field; empty when the form is valid
 */
export const validateForm = (
  values: Omit<FormValues, "country"> & { bankHolidays: string[] },
): FormErrors => {
  const errors: FormErrors = {};

  if (!values.availableDays.length) {
    errors.availableDays =
      "Select at least one day the service user is available";
  }

  if (values.prescriptionType === "") {
    errors.prescriptionType = "Select a prescription type";
  }

  //  Only checked once availability exists: with no days selected the
  //  availability error already covers the form, and no date can be collectable
  if (
    values.availableDays.length &&
    !isCollectable({
      date: values.startDate,
      availableDays: values.availableDays,
      bankHolidays: values.bankHolidays,
    })
  ) {
    errors.startDate =
      "Prescription Start Date must be a day the service user can collect on";
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
      errors.doseChange = `${values.prescriptionType === "Increasing" ? "Increase" : "Decrease"} (ml) must be a whole number between 0 and 60`;
    }

    if (!isValidChangePeriod(values.changePeriod)) {
      errors.changePeriod = "Every (days) must be a whole number of 1 or more";
    }
  }

  return errors;
};
