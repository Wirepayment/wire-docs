import { createOpenAPI } from "fumadocs-openapi/server";

// OpenAPI server instance pointing at the vendored public spec.
// The spec is copied in by scripts/sync-openapi.mjs (source of truth:
// buildry-wire/spec/openapi.yaml) so the build is hermetic / network-free.
export const openapi = createOpenAPI({
  input: ["./openapi/wire.yaml"],
  // No "try it" playground (removed 2026-10-12): the production API has no
  // test mode, so a playground could only send live requests with a real
  // secret key through this site. Each page shows request/response examples
  // instead.
});
