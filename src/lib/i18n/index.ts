import { ru, type Dict } from "./locales/ru";
import { en } from "./locales/en";
import { uk } from "./locales/uk";
import { es } from "./locales/es";
import { pt } from "./locales/pt";
import { de } from "./locales/de";
import { tr } from "./locales/tr";
import { zh } from "./locales/zh";
import { hi } from "./locales/hi";
import { fr } from "./locales/fr";

export type Locale = "ru" | "en" | "uk" | "es" | "pt" | "de" | "tr" | "zh" | "hi" | "fr";

export const DEFAULT_LOCALE: Locale = "ru";

export const LOCALES: { code: Locale; name: string; flag: string }[] = [
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

export const DICTS: Record<Locale, Dict> = { ru, en, uk, es, pt, de, tr, zh, hi, fr };

export function isLocale(v: string | undefined | null): v is Locale {
  return !!v && v in DICTS;
}

export type { Dict };
