import { ImageResponse } from "next/og";

// The share card for every docs page (Open Graph + Twitter). Latin text only,
// so it needs no font fetch at render time; a page that sets its own
// `openGraph` must name this image itself (lib/seo.ts SHARE_IMAGE) — Next
// drops the file-based one when a segment defines openGraph.
export const alt = "Wire Docs — payment gateway API for Mongolia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MINT = "#10B981";
const INK = "#0a0a0a";
const MUTED = "#50504a";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 72,
        background: "#fdfdfc",
        color: INK,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            display: "flex",
            width: 56,
            height: 56,
            borderRadius: 16,
            background: MINT,
          }}
        />
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>
          wire docs
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1.05,
          }}
        >
          One API for payments in Mongolia
        </div>
        <div style={{ display: "flex", fontSize: 34, color: MUTED }}>
          QR, cards, wallets and installments — REST API, SDKs, webhooks
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 28,
          color: MUTED,
        }}
      >
        <div style={{ display: "flex" }}>docs.wire.mn</div>
        <div style={{ display: "flex", color: MINT, fontWeight: 700 }}>
          Mongolian · English
        </div>
      </div>
    </div>,
    size,
  );
}
