import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    // Enable the language switcher; locale config comes from RootProvider's
    // i18n. Passing the full i18n object (which carries a `translations`
    // function) here would fail RSC serialization.
    i18n: true,
    nav: {
      title: (
        <span className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/wire-icon.png"
            alt=""
            width={22}
            height={22}
            className="rounded-[6px] mix-blend-multiply"
          />
          <span className="font-[family-name:var(--font-round)] text-[15px] font-bold tracking-tight">
            wire docs
          </span>
        </span>
      ),
    },
  };
}
