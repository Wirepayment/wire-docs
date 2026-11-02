import defaultMdxComponents from "fumadocs-ui/mdx";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { createAPIPage } from "fumadocs-openapi/ui";
import type { MDXComponents } from "mdx/types";
import { openapi } from "@/lib/openapi";

// `<APIPage>` is referenced by the generated OpenAPI reference MDX
// (content/docs/api/**). It must be in MDX scope for those pages to render.
// Playground off: production has no test mode (2026-10-12). Schema examples
// on, so every field shows a sample value next to its description.
const APIPage = createAPIPage(openapi, {
  playground: { enabled: false },
  schemaUI: { showExample: true },
});

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    APIPage,
    Tabs,
    Tab,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
