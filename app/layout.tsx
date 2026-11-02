import type { ReactNode } from "react";
import "./global.css";

// The real `<html>`/`<body>` shell lives in `app/[lang]/layout.tsx`, where the
// active locale is known. This root layout is a thin pass-through required by
// Next.js App Router when all pages live under the `[lang]` segment.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
