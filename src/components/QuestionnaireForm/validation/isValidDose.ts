export const isValidDose = (value: string) => {
  const dose = Number(value);
  return value !== "" && Number.isInteger(dose) && dose >= 0 && dose <= 60;
};
