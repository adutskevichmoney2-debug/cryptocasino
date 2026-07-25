"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { DEFAULT_LOCALE, DICTS, isLocale, type Locale } from "./index";

type Vars = Record<string, string | number>;

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  /** t("auth.err.emailTaken") | t("wallet.creditNote", { n: 3 }) */
  t: (path: string, vars?: Vars) => string;
  /** Access raw dictionary nodes (arrays/objects), e.g. home.why */
  dict: (typeof DICTS)[Locale];
}

const I18nContext = createContext<I18nContextValue | null>(null);

function resolve(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    vars[k] !== undefined ? String(vars[k]) : `{${k}}`,
  );
}

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale?: string;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(
    isLocale(initialLocale) ? initialLocale : DEFAULT_LOCALE,
  );

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    // Cookie is read server-side in the root layout → correct SSR language, no flash.
    document.cookie = `cc_locale=${l};path=/;max-age=31536000;samesite=lax`;
    document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (path: string, vars?: Vars) => {
      const hit = resolve(DICTS[locale], path);
      if (typeof hit === "string") return interpolate(hit, vars);
      // Fallback chain: en → ru → key itself (never crash the UI on a missing key)
      const enHit = resolve(DICTS.en, path);
      if (typeof enHit === "string") return interpolate(enHit, vars);
      const ruHit = resolve(DICTS.ru, path);
      if (typeof ruHit === "string") return interpolate(ruHit, vars);
      return path;
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, dict: DICTS[locale] }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
