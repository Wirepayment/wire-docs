import { defineDocs, defineConfig } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
  // Keep each page's processed Markdown so /llms-full.txt can serve the docs
  // as plain text to AI answer engines.
  docs: { postprocess: { includeProcessedMarkdown: true } },
});

export default defineConfig();
