// The legal entity behind wire.mn. Payments are a trust business — every public
// surface names the registered company and a real way to reach a human, so a
// merchant or a payer can see who they are dealing with before they part with
// money. The state register number is NOT shown on any page (owner decision
// 2026-10-26) — `registerNo` is read only by /llms.txt (lib/llms.ts).
//
// ⚠️ CANONICAL COPY. Mirrored verbatim into apps/checkout, apps/dashboard and
// apps/docs (no shared workspace package); each mirror carries a parity test
// that reads this file from disk, so drift fails their suite. Edit here first,
// then copy — never edit a mirror on its own.
export const COMPANY = {
  /** Registered name, Mongolian — as it appears on contracts and licences. */
  nameMn: "Билдрай Эй Ай ХХК",
  /** Registered name, Latin transliteration for non-Mongolian readers. */
  nameEn: "Buildry AI LLC",
  /** Улсын бүртгэлийн дугаар — зөвхөн /llms.txt-д. Хуудсан дээр бүү гарга. */
  registerNo: "7277609",
} as const;

export const CONTACT = {
  /** Support inbox — mirrored on /terms and /status. */
  email: "usukhbayar@buildry.cloud",
  /** Display form; `phoneHref` is the dialable E.164 form. */
  phone: "+976 9995-5899",
  phoneHref: "tel:+97699955899",
  facebook: "https://www.facebook.com/buildry",
} as const;
