// Prettier — adopted 2026-09-09 (before this, apps/* had no formatter config at
// all, so "unformatted" was unmeasurable and every agent guessed).
//
// These are Prettier's own defaults, pinned explicitly so the choice is visible
// rather than inherited. printWidth 80 is the one that mattered: the codebase
// was already hand-wrapped at ~80 with prose comments at ~78, so 80 preserves
// that intent — a wider setting would have unwrapped deliberate line breaks
// across 377 files.
//
// Scope is TS/TSX under apps/* only (see .prettierignore). Markdown, YAML and
// JSON are deliberately NOT formatted: the docs carry very long single-line
// table rows on purpose, and api/openapi.yaml + its generated copies are
// checked byte-for-byte by api/openapi_sync_test.go.
/** @type {import("prettier").Config} */
export default {
  printWidth: 80,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  tabWidth: 2,
};
