import { describe, expect, it } from "vitest";

import { brandNames } from "./brand-names";

// The names are spelled backwards here so the repo never holds them in clear.
const back = (s: string) => [...s].reverse().join("");

describe("brandNames()", () => {
  it("finds a whole Latin name in any case", () => {
    expect(brandNames(`Pay with ${back("YAPQ")} today`)).toHaveLength(1);
  });

  it("finds a two-word name with or without the space", () => {
    expect(brandNames(`via ${back("yenom tsom")}`)).toHaveLength(1);
    expect(brandNames(`via ${back("yenomtsom")}`)).toHaveLength(1);
  });

  it("finds an inflected Cyrillic name", () => {
    expect(brandNames(`${back("тмолог")}ын карт`)).toHaveLength(1);
  });

  it("does not flag ordinary words that merely contain a name", () => {
    expect(brandNames("tokens striped money bank Монголын банк")).toEqual([]);
  });
});
