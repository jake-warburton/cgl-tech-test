export const countrySlugToLabel = (slug: string) => {
  const words = slug.split("-");

  return words
    .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(" ");
};
