import { describe, it, expect } from "vitest";

import { projectDir } from "./project-dir";
import { readFileSync } from "node:fs";
import path from "node:path";
import { COMPANY, CONTACT } from "@/lib/company";

// lib/company.ts is mirrored from apps/landing (no shared workspace package).
// Read both off disk so a one-sided edit fails here rather than shipping two
// different company facts on two public surfaces.
const here = path.resolve(import.meta.dirname, "../lib/company.ts");
const canonical = path.join(
  projectDir("WIRE_LANDING_DIR", "apps/landing"),
  "lib/company.ts",
);

describe("lib/company.ts mirror", () => {
  it("matches apps/landing byte for byte", () => {
    expect(readFileSync(here, "utf8")).toBe(readFileSync(canonical, "utf8"));
  });

  it("still exports the facts the footer renders", () => {
    expect(COMPANY.nameMn).toBe("Билдрай Эй Ай ХХК");
    expect(CONTACT.phoneHref).toBe("tel:+97699955899");
  });
});
