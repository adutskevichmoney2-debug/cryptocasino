import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { cookies } from "next/headers";
import { I18nProvider } from "@/lib/i18n/provider";
import { AppShell } from "@/components/layout/AppShell";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  // TODO(deploy): заменить на реальный продакшн-домен
  metadataBase: new URL("https://cryptocasino.app"),
  title: {
    default: "CryptoCasino — Crypto Casino & Sportsbook",
    template: "%s | CryptoCasino",
  },
  description:
    "CryptoCasino — криптовалютное казино и букмекер: слоты, live-казино, ставки на спорт. Мгновенные депозиты и выплаты в BTC, ETH, USDT и ещё 9 монетах.",
  applicationName: "CryptoCasino",
  openGraph: {
    title: "CryptoCasino — Crypto Casino & Sportsbook",
    description:
      "Слоты, live-казино и ставки на спорт с мгновенными крипто-выплатами.",
    images: ["/images/hero.webp"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0E13",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Язык читается из cookie на сервере → корректный SSR без "мигания" локали.
  const cookieStore = await cookies();
  const raw = cookieStore.get("cc_locale")?.value;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;

  return (
    <html lang={locale} className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full">
        <I18nProvider initialLocale={locale}>
          <AppShell>{children}</AppShell>
        </I18nProvider>
      </body>
    </html>
  );
}
