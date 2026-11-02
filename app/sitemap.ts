import type { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { sitemapEntries, type DocPage } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries(
    (slugs, lang) => source.getPage(slugs, lang) as DocPage | undefined,
    source.getPages() as DocPage[],
  );
}
