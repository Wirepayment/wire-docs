import { source } from "@/lib/source";
import { llmsIndex } from "@/lib/llms";
import { translation, type DocPage } from "@/lib/seo";

export const dynamic = "force-static";

const getPage = (slugs: string[], lang: string) =>
  source.getPage(slugs, lang) as DocPage | undefined;

export function GET() {
  const mn = source.getPages("mn") as DocPage[];
  const en = (source.getPages("en") as DocPage[]).filter((p) =>
    translation(getPage, p.slugs, "en"),
  );
  return new Response(llmsIndex(mn, en), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
