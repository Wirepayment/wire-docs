import { source } from "@/lib/source";
import { llmsPage } from "@/lib/llms";
import { translation, type DocPage } from "@/lib/seo";

export const dynamic = "force-static";

const getPage = (slugs: string[], lang: string) =>
  source.getPage(slugs, lang) as DocPage | undefined;

export async function GET() {
  const mn = source.getPages("mn");
  const en = source
    .getPages("en")
    .filter((p) => translation(getPage, p.slugs, "en"));
  const parts = await Promise.all(
    [...mn, ...en].map(async (p) =>
      llmsPage(p as DocPage, await p.data.getText("processed")),
    ),
  );
  return new Response(parts.join("\n---\n\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
