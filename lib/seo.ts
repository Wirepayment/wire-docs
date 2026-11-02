import type { Metadata, MetadataRoute } from "next";

// SEO for docs.wire.mn. Pure functions over a minimal page shape so they can
// be tested without compiling MDX; the routes pass fumadocs pages in.
//
// Languages: Mongolian is the default (`/docs/...`), English lives under
// `/en/docs/...`. A page without an `.en.mdx` file is still served at its
// English URL (fumadocs falls back to the Mongolian file), so that URL is a
// duplicate: it canonicalizes to the Mongolian page, carries no hreflang and
// stays out of the sitemap.

export const DOCS_URL = "https://docs.wire.mn";
export const SITE_NAME = "Wire Docs";
export const DEFAULT_LANG = "mn";
export const LANGS = ["mn", "en"] as const;

const HOME_TITLES: Record<string, string> = {
  mn: "Wire Docs — Монголын төлбөрийн gateway API",
  en: "Wire Docs — Mongolian payment gateway API",
};

export function homeTitle(lang: string): string {
  return HOME_TITLES[lang] ?? HOME_TITLES.mn ?? SITE_NAME;
}

export interface DocPage {
  url: string;
  /** Source file path, e.g. `quickstart.mdx` / `quickstart.en.mdx`. */
  path: string;
  slugs: string[];
  data: { title: string; description?: string };
}

export type GetPage = (slugs: string[], lang: string) => DocPage | undefined;

export function absolute(url: string): string {
  return `${DOCS_URL}${url}`;
}

/** The page a language really has (not the default-language fallback). */
export function translation(
  getPage: GetPage,
  slugs: string[],
  lang: string,
): DocPage | undefined {
  const page = getPage(slugs, lang);
  if (!page) return undefined;
  if (lang === DEFAULT_LANG) return page;
  const base = getPage(slugs, DEFAULT_LANG);
  return base && base.path === page.path ? undefined : page;
}

/** `{ mn: url, en: url }` for the languages this page is written in. */
export function languageUrls(
  getPage: GetPage,
  slugs: string[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const lang of LANGS) {
    const page = translation(getPage, slugs, lang);
    if (page) out[lang] = absolute(page.url);
  }
  return out;
}

/** First paragraph of a (possibly long, Markdown) description, plain text,
 *  cut at a sentence boundary near the length search results show. API
 *  reference pages carry whole error tables in their frontmatter. */
export function summarize(description: string | undefined, max = 200): string {
  if (!description) return "";
  const para = description.trim().split(/\n\s*\n/)[0] ?? "";
  const plain = para
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`/g, "")
    .replace(/\*\*|__/g, "")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max);
  const stop = cut.lastIndexOf(". ");
  return stop > max / 2 ? cut.slice(0, stop + 1) : `${cut.trimEnd()}…`;
}

export function docMetadata(
  getPage: GetPage,
  page: DocPage,
  lang: string,
): Metadata {
  const urls = languageUrls(getPage, page.slugs);
  const own = urls[lang];
  const canonical = own ?? urls[DEFAULT_LANG] ?? absolute(page.url);
  const isHome = page.slugs.length === 0;
  const title = isHome ? homeTitle(lang) : page.data.title;
  const description = summarize(page.data.description);

  const languages: Record<string, string> = {};
  if (own && Object.keys(urls).length > 1) {
    Object.assign(languages, urls);
    languages["x-default"] = urls[DEFAULT_LANG] ?? own;
  }

  return {
    title: isHome ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      ...(Object.keys(languages).length ? { languages } : {}),
    },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      url: canonical,
      title,
      description,
      locale: lang === "en" ? "en_US" : "mn_MN",
    },
    twitter: { card: "summary", title, description },
  };
}

/** Every page in every language it is written in, with hreflang pairs. No
 *  lastmod: the image is built without git history, and a build timestamp on
 *  every URL is a signal search engines learn to ignore. */
export function sitemapEntries(
  getPage: GetPage,
  pages: DocPage[],
): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  const out: MetadataRoute.Sitemap = [];
  for (const page of pages) {
    const urls = languageUrls(getPage, page.slugs);
    for (const url of Object.values(urls)) {
      if (seen.has(url)) continue;
      seen.add(url);
      out.push({
        url,
        changeFrequency: "weekly",
        priority: page.slugs.length === 0 ? 1 : 0.7,
        ...(Object.keys(urls).length > 1
          ? { alternates: { languages: urls } }
          : {}),
      });
    }
  }
  return out;
}
