import bankHolidaysByCountry from "../../data/bank-holidays.json";

export const getBankHolidayDates = (slug: string) => {
  if (!(slug in bankHolidaysByCountry)) {
    throw new Error(`No bank holiday data for country: ${slug}`);
  }

  return bankHolidaysByCountry[
    slug as keyof typeof bankHolidaysByCountry
  ].events.map((event) => event.date);
};
