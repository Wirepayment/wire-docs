import { DOCS_URL, absolute, summarize, type DocPage } from "@/lib/seo";

// llms.txt / llms-full.txt (https://llmstxt.org) for docs.wire.mn. Public
// material — operator-agnostic, no brand names (CLAUDE.md rule #9); the page
// text itself is already public on the site.

export const SPEC_URL =
  "https://raw.githubusercontent.com/buildry-wire/spec/main/openapi.yaml";

const INTRO = [
  "# Wire Docs",
  "",
  "> Wire бол Монголын бизнесүүдэд зориулсан төлбөрийн gateway: нэг REST API-аар Монголын төлбөрийн операторуудад (банкны апп, цахим хэтэвч, QR, хуваан төлөх зээл) холбогдоно. Wire is a payment gateway for Mongolia: one REST API for the Mongolian payment operators enabled on a merchant's account.",
  "",
  `Монгол баримт: ${DOCS_URL}/docs · English: ${DOCS_URL}/en/docs · OpenAPI 3.1: ${SPEC_URL} · Бүрэн текст / full text: ${DOCS_URL}/llms-full.txt · Бүтээгдэхүүн / product: https://wire.mn`,
  "",
  "Мөнгөн дүн бүхэл тоогоор, төгрөгөөр (MNT). Amounts are integers in MNT.",
  "",
];

function item(page: DocPage): string {
  const desc = summarize(page.data.description);
  const link = `[${page.data.title}](${absolute(page.url)})`;
  return desc ? `- ${link}: ${desc}` : `- ${link}`;
}

export function llmsIndex(mn: DocPage[], en: DocPage[]): string {
  return [
    ...INTRO,
    "## Монгол",
    "",
    ...mn.map(item),
    "",
    "## English",
    "",
    ...en.map(item),
    "",
  ].join("\n");
}

/** Drop the generated `<APIPage …/>` embed — the operation itself is in the
 *  page description and the OpenAPI spec linked from every reference page. */
export function cleanMarkdown(md: string): string {
  return md
    .split("\n")
    .filter((line) => !/^\s*<APIPage\b/.test(line))
    .join("\n")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function llmsPage(page: DocPage, markdown: string): string {
  const isApi = page.slugs[0] === "api";
  return [
    `# ${page.data.title}`,
    "",
    `URL: ${absolute(page.url)}`,
    ...(isApi ? [`OpenAPI: ${SPEC_URL}`] : []),
    "",
    ...(page.data.description ? [page.data.description.trim(), ""] : []),
    cleanMarkdown(markdown),
    "",
  ].join("\n");
}
