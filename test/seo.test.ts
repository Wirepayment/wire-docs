import { describe, it, expect } from "vitest";

import { projectDir } from "./project-dir";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  DOCS_URL,
  docJsonLd,
  docMetadata,
  fallbackDescription,
  sitemapEntries,
  summarize,
  translation,
  type DocPage,
  type GetPage,
} from "@/lib/seo";
import { cleanMarkdown, llmsIndex, llmsPage } from "@/lib/llms";
import { ALLOWED_CRAWLERS } from "@/lib/crawlers";
import robots from "@/app/robots";
import { config as middlewareConfig } from "@/middleware";
import { brandNames } from "./brand-names";

// A tiny fake of the fumadocs loader: quickstart is translated, the API
// reference exists only in Mongolian (English URL falls back to that file).
const PAGES: Record<string, DocPage> = {
  "mn:": page([], "/docs", "index.mdx", "Wire Docs", "Нэг integration."),
  "en:": page([], "/en/docs", "index.en.mdx", "Wire Docs", "One integration."),
  "mn:quickstart": page(["quickstart"], "/docs/quickstart", "quickstart.mdx"),
  "en:quickstart": page(
    ["quickstart"],
    "/en/docs/quickstart",
    "quickstart.en.mdx",
  ),
  "mn:api": page(["api"], "/docs/api", "api/index.mdx"),
  "en:api": page(["api"], "/en/docs/api", "api/index.mdx"),
};

function page(
  slugs: string[],
  url: string,
  file: string,
  title = "Title",
  description = "Description.",
): DocPage {
  return { slugs, url, path: file, data: { title, description } };
}

const getPage: GetPage = (slugs, lang) => PAGES[`${lang}:${slugs.join("/")}`];

describe("translation()", () => {
  it("treats the default-language fallback as no translation", () => {
    expect(translation(getPage, ["quickstart"], "en")?.url).toBe(
      "/en/docs/quickstart",
    );
    expect(translation(getPage, ["api"], "en")).toBeUndefined();
    expect(translation(getPage, ["api"], "mn")?.url).toBe("/docs/api");
  });
});

describe("docMetadata()", () => {
  it("pairs translated pages with hreflang and x-default = mn", () => {
    const meta = docMetadata(getPage, PAGES["en:quickstart"]!, "en");
    expect(meta.alternates?.canonical).toBe(`${DOCS_URL}/en/docs/quickstart`);
    expect(meta.alternates?.languages).toEqual({
      mn: `${DOCS_URL}/docs/quickstart`,
      en: `${DOCS_URL}/en/docs/quickstart`,
      "x-default": `${DOCS_URL}/docs/quickstart`,
    });
  });

  it("canonicalizes an untranslated English URL to the Mongolian page", () => {
    const meta = docMetadata(getPage, PAGES["en:api"]!, "en");
    expect(meta.alternates?.canonical).toBe(`${DOCS_URL}/docs/api`);
    expect(meta.alternates?.languages).toBeUndefined();
  });

  it("gives the docs home a descriptive absolute title", () => {
    const meta = docMetadata(getPage, PAGES["mn:"]!, "mn");
    expect(meta.title).toEqual({
      absolute: "Wire Docs — Монголын төлбөрийн gateway API",
    });
  });
});

describe("share image and description", () => {
  // A page-level openGraph drops the file-based image, so every docs URL
  // shipped without og:image until 2026-11-15.
  it("names the share image on every page, in both cards", () => {
    for (const [key, p] of Object.entries(PAGES)) {
      const meta = docMetadata(getPage, p, key.split(":")[0]!);
      expect(JSON.stringify(meta.openGraph), key).toContain("/opengraph-image");
      expect(JSON.stringify(meta.twitter), key).toContain("/opengraph-image");
      expect(JSON.stringify(meta.twitter), key).toContain(
        "summary_large_image",
      );
    }
    expect(
      readFileSync(
        path.resolve(import.meta.dirname, "../app/opengraph-image.tsx"),
        "utf8",
      ),
    ).toContain("ImageResponse");
  });

  // The i18n middleware rewrites any path it matches under a language, where
  // the image does not exist: every share card would be a 404.
  it("keeps the share image out of the language middleware", () => {
    const [matcher] = middlewareConfig.matcher;
    const skipped = new RegExp(`^${matcher}$`);
    expect(skipped.test("/opengraph-image")).toBe(false);
    expect(skipped.test("/docs/quickstart")).toBe(true);
  });

  it("describes a page that ships no description of its own", () => {
    const bare: DocPage = {
      slugs: ["api", "get"],
      url: "/docs/api/get",
      path: "api/get.mdx",
      data: { title: "Retrieve a payment" },
    };
    const get: GetPage = (slugs, lang) =>
      lang === "mn" && slugs.join("/") === "api/get" ? bare : undefined;
    for (const lang of ["mn", "en"]) {
      const meta = docMetadata(get, bare, lang);
      expect(meta.description).toBe(
        fallbackDescription("Retrieve a payment", lang),
      );
      expect(meta.description).toContain("Retrieve a payment");
    }
    // A page with its own description keeps it.
    expect(
      docMetadata(getPage, PAGES["mn:quickstart"]!, "mn").description,
    ).toBe("Description.");
  });
});

describe("docJsonLd()", () => {
  type Node = Record<string, unknown> & { "@type": string };
  const graph = (key: string) =>
    (
      docJsonLd(getPage, PAGES[key]!, key.split(":")[0]!) as {
        "@graph": Node[];
      }
    )["@graph"];

  it("describes the page as a TechArticle at its canonical URL", () => {
    for (const key of Object.keys(PAGES)) {
      const lang = key.split(":")[0]!;
      const article = graph(key).find((n) => n["@type"] === "TechArticle")!;
      const meta = docMetadata(getPage, PAGES[key]!, lang);
      expect(article.url, key).toBe(meta.alternates?.canonical);
      expect(article.description, key).toBe(meta.description);
      expect(article.inLanguage, key).toBe(lang);
    }
  });

  it("places a page under the docs home of its language", () => {
    const crumbs = graph("en:quickstart").find(
      (n) => n["@type"] === "BreadcrumbList",
    ) as unknown as { itemListElement: { position: number; item: string }[] };
    expect(crumbs.itemListElement.map((c) => [c.position, c.item])).toEqual([
      [1, `${DOCS_URL}/en/docs`],
      [2, `${DOCS_URL}/en/docs/quickstart`],
    ]);
    const home = graph("mn:").find(
      (n) => n["@type"] === "BreadcrumbList",
    ) as unknown as { itemListElement: unknown[] };
    expect(home.itemListElement).toHaveLength(1);
  });

  it("invents no ratings and names no brand", () => {
    const json = JSON.stringify(graph("mn:quickstart"));
    expect(json).not.toMatch(/aggregateRating|"review"/i);
    expect(brandNames(json)).toEqual([]);
  });
});

describe("summarize()", () => {
  it("keeps the first paragraph as plain text, identifiers intact", () => {
    const desc =
      "Creates a PaymentIntent in status `requires_payment_method` — **not** an error.\n\n**Errors**:\n- `400 x`";
    expect(summarize(desc)).toBe(
      "Creates a PaymentIntent in status requires_payment_method — not an error.",
    );
  });

  it("cuts long text at a sentence boundary", () => {
    const long = `${"Word ".repeat(30).trim()}. ${"More ".repeat(40)}`;
    const out = summarize(long);
    expect(out.length).toBeLessThanOrEqual(200);
    expect(out.endsWith(".")).toBe(true);
  });
});

describe("sitemap.xml", () => {
  it("lists real pages only, translated ones with hreflang", () => {
    const entries = sitemapEntries(getPage, Object.values(PAGES));
    const urls = entries.map((e) => e.url).sort();
    expect(urls).toEqual(
      [
        `${DOCS_URL}/docs`,
        `${DOCS_URL}/en/docs`,
        `${DOCS_URL}/docs/quickstart`,
        `${DOCS_URL}/en/docs/quickstart`,
        `${DOCS_URL}/docs/api`,
      ].sort(),
    );
    const api = entries.find((e) => e.url === `${DOCS_URL}/docs/api`);
    expect(api?.alternates).toBeUndefined();
    const qs = entries.find((e) => e.url === `${DOCS_URL}/docs/quickstart`);
    expect(qs?.alternates?.languages).toHaveProperty("en");
    for (const e of entries) expect(e.lastModified).toBeUndefined();
  });
});

describe("robots.txt", () => {
  it("names the crawlers, hides only the search API, points at the sitemap", () => {
    const r = robots();
    const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
    const named = rules.flatMap((rule) =>
      Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent],
    );
    expect(named).toEqual(expect.arrayContaining([...ALLOWED_CRAWLERS, "*"]));
    for (const rule of rules) expect(rule.disallow).toBe("/api/");
    expect(r.sitemap).toBe(`${DOCS_URL}/sitemap.xml`);
  });

  it("uses the same crawler list as apps/landing", () => {
    const landing = readFileSync(
      path.join(
        projectDir("WIRE_LANDING_DIR", "apps/landing"),
        "lib/crawlers.ts",
      ),
      "utf8",
    );
    const names = [...landing.matchAll(/^\s+"([^"]+)",$/gm)].map((m) => m[1]);
    expect([...ALLOWED_CRAWLERS]).toEqual(names);
  });
});

describe("llms.txt / llms-full.txt", () => {
  it("indexes both languages with absolute links and no brand names", () => {
    const txt = llmsIndex(
      [PAGES["mn:"]!, PAGES["mn:quickstart"]!],
      [PAGES["en:quickstart"]!],
    );
    expect(txt.startsWith("# Wire Docs")).toBe(true);
    expect(txt).toContain(`(${DOCS_URL}/docs/quickstart)`);
    expect(txt).toContain(`(${DOCS_URL}/en/docs/quickstart)`);
    expect(txt).toContain("## English");
    expect(brandNames(txt)).toEqual([]);
  });

  it("drops the generated APIPage embed and MDX comments", () => {
    const md =
      '{/* generated */}\n\n<APIPage document={"./openapi/wire.yaml"} operations={[]} />\n\nText.';
    expect(cleanMarkdown(md)).toBe("Text.");
  });

  it("links API reference pages to the OpenAPI spec", () => {
    const out = llmsPage(PAGES["mn:api"]!, "Body");
    expect(out).toContain("URL: https://docs.wire.mn/docs/api");
    expect(out).toContain("OpenAPI: https://raw.githubusercontent.com/");
  });
});
