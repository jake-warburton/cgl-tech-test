const lowercaseWords = ["and"];

/**
 * Formats a hyphenated slug as a label: words are separated with
 * spaces and capitalized, except joining words such as "and".
 * e.g. "england-and-wales" → "England and Wales"
 * @param slug - a lowercase hyphen-separated string
 * @returns the human-readable label
 */
export const countrySlugToLabel = (slug: string) => {
  const words = slug.split("-");

  return words
    .map((word) => {
      if (lowercaseWords.includes(word)) return word;

      return `${word[0].toUpperCase()}${word.slice(1)}`;
    })
    .join(" ");
};
