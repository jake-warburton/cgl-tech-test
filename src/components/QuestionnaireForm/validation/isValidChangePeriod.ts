/**
 * Checks a change period entered as a string is a usable number
 * of days between dose changes.
 * e.g. "3" → true, "0" → false, "" → false
 * @param value - the raw input field value
 * @returns true when the value is a whole number of 1 or more
 */
export const isValidChangePeriod = (value: string) => {
  const changePeriod = Number(value);
  return value !== "" && Number.isInteger(changePeriod) && changePeriod > 0;
};
