import { RootProvider } from "fumadocs-ui/provider/next";
import { COMPANY } from "@/lib/company";
import { Rubik, Comfortaa, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { provider } from "@/lib/i18n";
import type { Metadata } from "next";
import { DOCS_URL, SITE_NAME, homeTitle } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL(DOCS_URL),
    title: {
      default: homeTitle(lang),
      template: `%s · ${SITE_NAME}`,
    },
    applicationName: SITE_NAME,
    robots: { index: true, follow: true },
    openGraph: { siteName: SITE_NAME, type: "website" },
  };
}

const rubik = Rubik({
  subsets: ["latin", "cyrillic"],
  variable: "--font-rubik",
  display: "swap",
});

const comfortaa = Comfortaa({
  subsets: ["latin", "cyrillic"],
  variable: "--font-comfortaa",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
});

export default async function LangLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;
  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${rubik.variable} ${comfortaa.variable} ${jetbrains.variable}`}
    >
      <body className="flex flex-col min-h-screen">
        <RootProvider i18n={provider(lang)}>
          {children}
          <footer className="flex shrink-0 flex-col items-center justify-between gap-3 border-t border-fd-border px-4 py-4 text-xs text-fd-muted-foreground sm:flex-row sm:px-6">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} {COMPANY.nameMn} · wire.mn
            </p>
            <a
              href="https://buildry.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-fd-border px-3 py-1 text-[11px] font-medium transition-colors hover:text-fd-foreground"
            >
              A product by Buildry ↗
            </a>
          </footer>
        </RootProvider>
      </body>
    </html>
  );
}
