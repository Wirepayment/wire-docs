import { existsSync } from "node:fs";
import path from "node:path";

const MONOREPO = path.resolve(import.meta.dirname, "..", "..", "..");

/** projectDir is where a sibling project's source lives for a contract test.
 *  In the monorepo it is a fixed path under the repo root; once the projects
 *  live in separate repos (docs/superpowers/specs/2026-11-01-repo-split-design.md)
 *  CI checks the sibling out and names it in the env var.
 *
 *  A missing directory throws rather than returning a path that reads as
 *  empty: a contract guard with nothing to compare against has to fail, not
 *  pass having checked nothing. This file is mirrored in apps/admin,
 *  apps/dashboard, apps/checkout and apps/docs. */
export function projectDir(
  envVar:
    | "WIRE_API_DIR"
    | "WIRE_LANDING_DIR"
    | "WIRE_DASHBOARD_DIR"
    | "WIRE_CHECKOUT_DIR",
  monorepoRel: string,
): string {
  const dir = process.env[envVar] || path.join(MONOREPO, monorepoRel);
  if (!existsSync(dir)) {
    throw new Error(
      `${envVar}: ${dir} does not exist — check the sibling repo out and point ${envVar} at it`,
    );
  }
  return dir;
}
