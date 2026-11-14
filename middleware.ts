import { createI18nMiddleware } from "fumadocs-core/i18n/middleware";
import { i18n } from "@/lib/i18n";

export default createI18nMiddleware(i18n);

export const config = {
  // Run on all paths except Next internals, the API routes (search), the
  // share image (it has no extension, and a language prefix makes it a 404)
  // and static assets.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|opengraph-image|.*\\..*).*)",
  ],
};
