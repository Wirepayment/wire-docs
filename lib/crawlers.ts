// ⚠️ MIRROR of apps/landing/lib/crawlers.ts (no shared workspace package);
// test/seo.test.ts fails if the two drift.
// Search and AI-answer crawlers named in robots.txt. `*` already allows
// everyone; naming them states the decision explicitly so a later blanket
// rule cannot silently shut out the engines merchants actually ask.
// Owner decision (2026-10-26): wire.mn and docs.wire.mn are public marketing
// and reference material — be findable in Google, Bing and AI answers.
export const ALLOWED_CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "Google-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Applebot",
  "Applebot-Extended",
  "DuckDuckBot",
  "YandexBot",
] as const;
