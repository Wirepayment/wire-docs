// Syncs the docs site's API reference from the CANONICAL spec.
//
// There is exactly one source of truth for the API surface: api/openapi.yaml at
// the repo root. Both consumers are generated from it —
//   • this site        → openapi/wire.yaml  + content/docs/api/**.mdx
//   • the dashboard    → apps/dashboard/lib/openapi.json  (make docs-spec)
// so the in-dashboard reference and docs.wire.mn can never describe different
// APIs. Editing either generated artifact by hand is what caused them to drift
// before; edit the spec and re-run `make docs-spec`.
//
// WIRE_OPENAPI_SRC overrides the source (e.g. to publish from a spec checkout).
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";

const repoRoot = resolve(import.meta.dirname, "../../..");
const src = process.env.WIRE_OPENAPI_SRC || join(repoRoot, "api/openapi.yaml");
const dest = join(import.meta.dirname, "../openapi/wire.yaml");

if (!existsSync(src)) {
  console.error(
    `OpenAPI source not found: ${src}\nSet WIRE_OPENAPI_SRC to point at the spec.`,
  );
  process.exit(1);
}
mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log(`synced ${src} -> ${dest}`);

// Regenerate the API reference MDX so one command keeps spec + docs in sync.
await import("./generate-api.mjs");

// …then the object-schema page. It runs last because generateFiles owns
// content/docs/api and would otherwise clear the file out from under us.
const schemas = spawnSync(
  "python3",
  [join(import.meta.dirname, "generate-schemas.py")],
  { stdio: "inherit" },
);
if (schemas.status !== 0) {
  console.error(
    "generate-schemas.py failed — is python3 with PyYAML installed?",
  );
  process.exit(schemas.status ?? 1);
}
