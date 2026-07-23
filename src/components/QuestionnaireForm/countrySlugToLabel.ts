const uncapitalizedWords = ["and"];

export const countrySlugToLabel = (slug: string) => {
  const words = slug.split("-");

  return words
    .map((word) => {
      if (uncapitalizedWords.includes(word)) return word;

      return `${word[0].toUpperCase()}${word.slice(1)}`;
    })
    .join(" ");
};
