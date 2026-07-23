export const countrySlugToLabel = (slug: string) => {
  const words = slug.split("-");

  const capitalizedWords: string[] = [];

  words.forEach((word) =>
    capitalizedWords.push(`${word[0].toUpperCase()}${word.slice(1)}`),
  );

  return capitalizedWords.join(" ");
};
