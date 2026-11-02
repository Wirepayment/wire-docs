import { createHash } from "node:crypto";

// Public copy must stay operator-agnostic (CLAUDE.md rule #9). This repo is
// public, so the guard lists the names it forbids as hashes, not in clear: a
// guard that spells out every operator and competitor would itself break the
// rule. Card schemes (Visa, Mastercard) are not operators and stay allowed.
//
// Matching: the text is split into words; a word, or two adjacent words
// joined with or without a space, is checked against EXACT (Latin names,
// whole word) and against PREFIX (Cyrillic names, so inflected forms such as
// a genitive suffix still match). To add a name: sha256 of its lowercase
// form, first 16 hex chars.
const EXACT = new Set([
  "b841a72ef109b4c6",
  "2bed2032ed3d8300",
  "6ecdcb213b610b7e",
  "ef2477fdaa02c661",
  "b09d3966dc6f7664",
  "946b3214b4ad1622",
  "dd3901003412e4d7",
  "687021e1d987c187",
  "40d8f598b47ca059",
  "fcb248ee6d38bd1b",
  "c6a6ea89bb6fef43",
  "044984e115110d53",
  "1b2455e9fef29158",
  "724ec1a3f9b8f747",
]);
const PREFIX: ReadonlyArray<readonly [number, string]> = [
  [9, "31253c0edd03f09b"],
  [6, "04e96df006b89754"],
  [5, "c4ae74439b213d32"],
  [10, "f959a7522ceef870"],
];

const digest = (s: string) =>
  createHash("sha256").update(s).digest("hex").slice(0, 16);

/** Every forbidden brand name found in text (empty when the copy is clean). */
export function brandNames(text: string): string[] {
  const words = text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
  const hits = new Set<string>();
  words.forEach((word, i) => {
    const next = words[i + 1];
    const candidates = next ? [word, word + next, `${word} ${next}`] : [word];
    // One hit per word: the shortest candidate that matches.
    const hit = candidates.find((c) => {
      if (EXACT.has(digest(c))) return true;
      const chars = [...c];
      return PREFIX.some(
        ([n, h]) =>
          chars.length >= n && digest(chars.slice(0, n).join("")) === h,
      );
    });
    if (hit) hits.add(hit);
  });
  return [...hits];
}
