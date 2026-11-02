import type { MetadataRoute } from "next";
import { ALLOWED_CRAWLERS } from "@/lib/crawlers";
import { DOCS_URL } from "@/lib/seo";

/** robots.txt — the docs are public reference material. `/api/` is only the
 *  site-search endpoint. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: [...ALLOWED_CRAWLERS], allow: "/", disallow: "/api/" },
      { userAgent: "*", allow: "/", disallow: "/api/" },
    ],
    sitemap: `${DOCS_URL}/sitemap.xml`,
    host: DOCS_URL,
  };
}
