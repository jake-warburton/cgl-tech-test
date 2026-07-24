import bankHolidaysByCountry from "../../data/bank-holidays.json";

/**
 * Extracts a country's bank holiday dates from the bundled gov.uk data.
 * @param slug - a country key from the data, e.g. "england-and-wales"
 * @returns the country's bank holidays as "yyyy-MM-dd" strings
 * @throws when the country has no entry in the bundled data
 */
export const getBankHolidayDates = (slug: string) => {
  if (!(slug in bankHolidaysByCountry)) {
    throw new Error(`No bank holiday data for country: ${slug}`);
  }

  return bankHolidaysByCountry[
    slug as keyof typeof bankHolidaysByCountry
  ].events.map((event) => event.date);
};
