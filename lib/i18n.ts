import { defineI18n } from "fumadocs-core/i18n";
import { defineI18nUI } from "fumadocs-ui/i18n";

// Bilingual docs: Mongolian (default, no file suffix) + English (`.en.mdx`).
// `parser: "dot"` is the Fumadocs default — files like `index.en.mdx` are the
// English locale, suffix-less files are the default (mn) locale.
export const i18n = defineI18n({
  defaultLanguage: "mn",
  languages: ["mn", "en"],
  // Show the locale prefix only for non-default languages, so `/docs` serves
  // Mongolian and `/en/docs` serves English.
  hideLocale: "default-locale",
});

// Fumadocs UI built-in strings. English ships by default; provide Mongolian.
export const { provider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: "English",
    },
    mn: {
      displayName: "Монгол",
      search: "Хайх",
      searchNoResult: "Үр дүн олдсонгүй",
      toc: "Энэ хуудсанд",
      tocNoHeadings: "Гарчиг алга",
      lastUpdate: "Сүүлд шинэчилсэн",
      chooseLanguage: "Хэл сонгох",
      nextPage: "Дараах",
      previousPage: "Өмнөх",
      chooseTheme: "Загвар",
      editOnGithub: "GitHub дээр засах",
    },
  },
});
