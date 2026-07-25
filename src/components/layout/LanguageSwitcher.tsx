"use client";

import { Check, Globe } from "lucide-react";
import { LOCALES } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n/provider";
import { Dropdown } from "@/components/ui/Dropdown";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  compact = false,
  up = false,
}: {
  compact?: boolean;
  up?: boolean;
}) {
  const { locale, setLocale, t } = useI18n();
  const current = LOCALES.find((l) => l.code === locale)!;

  return (
    <Dropdown
      width="w-56"
      up={up}
      trigger={(open) => (
        <button
          className={cn(
            "flex h-10 items-center gap-1.5 rounded-[10px] px-2.5 text-sm font-semibold text-sub transition-colors hover:bg-raise hover:text-ink",
            open && "bg-raise text-ink",
          )}
          aria-label={t("common.language")}
        >
          <Globe size={17} />
          {!compact && <span className="uppercase">{current.code}</span>}
        </button>
      )}
    >
      {(close) => (
        <div className="max-h-[340px] overflow-y-auto p-1.5">
          <p className="px-2.5 pb-1.5 pt-1 text-[11px] font-bold uppercase tracking-wider text-mute">
            {t("misc.chooseLang")}
          </p>
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code);
                close();
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-semibold transition-colors hover:bg-hover",
                l.code === locale ? "text-em" : "text-sub hover:text-ink",
              )}
            >
              <span className="text-base leading-none">{l.flag}</span>
              <span className="flex-1">{l.name}</span>
              {l.code === locale && <Check size={15} />}
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
