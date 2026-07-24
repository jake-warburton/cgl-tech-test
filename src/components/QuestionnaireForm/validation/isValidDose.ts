/**
 * Checks a dose entered as a string is a whole number of ml
 * within the prescribable range.
 * e.g. "30" → true, "0.5" → false, "" → false
 * @param value - the raw input field value
 * @returns true when the value is a whole number between 0 and 60
 */
export const isValidDose = (value: string) => {
  const dose = Number(value);
  return value !== "" && Number.isInteger(dose) && dose >= 0 && dose <= 60;
};
