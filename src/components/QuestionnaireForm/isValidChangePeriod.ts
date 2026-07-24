export const isValidChangePeriod = (value: string) => {
  const changePeriod = Number(value);
  return value !== "" && Number.isInteger(changePeriod) && changePeriod > 0;
};
