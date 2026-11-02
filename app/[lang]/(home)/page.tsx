import { notFound, permanentRedirect } from "next/navigation";
import { i18n } from "@/lib/i18n";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  // Paths the middleware matcher skips (`/api`, `/favicon.ico`) land here with
  // a junk `lang` — 404 them instead of redirecting to `/api/docs` (also a 404).
  if (!(i18n.languages as readonly string[]).includes(lang)) notFound();
  // `/` -> `/docs` (mn, default-locale prefix hidden); `/en` -> `/en/docs`.
  permanentRedirect(lang === "mn" ? "/docs" : `/${lang}/docs`);
}
