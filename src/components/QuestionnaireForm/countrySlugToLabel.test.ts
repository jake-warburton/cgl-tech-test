import { describe, expect, it } from "vitest";

import { countrySlugToLabel } from "./countrySlugToLabel";

describe("countrySlugToLabel", () => {
  it("converts a single-word slug to a capitalised label", () => {
    const result = countrySlugToLabel("scotland");

    expect(result).toBe("Scotland");
  });

  it("converts a hyphenated slug to space-separated capitalised words", () => {
    const result = countrySlugToLabel("northern-ireland");

    expect(result).toBe("Northern Ireland");
  });

  it("keeps joining words like 'and' in lowercase", () => {});
});
