"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { COINS } from "@/lib/data/coins";
import { useI18n } from "@/lib/i18n/provider";

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const cols: { title: string; links: { href: string; label: string }[] }[] = [
    {
      title: t("footer.casino"),
      links: [
        { href: "/casino?cat=slots", label: t("nav.slots") },
        { href: "/casino?cat=live", label: t("nav.liveCasino") },
        { href: "/casino?cat=game-shows", label: t("nav.gameShows") },
        { href: "/casino?cat=originals", label: t("nav.originals") },
        { href: "/providers", label: t("nav.providers") },
      ],
    },
    {
      title: t("footer.sports"),
      links: [
        { href: "/sports", label: t("sports.title") },
        { href: "/sports", label: t("sports.live") },
        { href: "/bonuses", label: t("nav.bonuses") },
        { href: "/tournaments", label: t("nav.tournaments") },
        { href: "/vip", label: t("nav.vip") },
      ],
    },
    {
      title: t("footer.support"),
      links: [
        { href: "/support", label: t("footer.contact") },
        { href: "/support", label: t("footer.faq") },
        { href: "/referral", label: t("nav.referral") },
        { href: "/fairness", label: t("legal.fairnessTitle") },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { href: "/terms", label: t("legal.termsTitle") },
        { href: "/privacy", label: t("legal.privacyTitle") },
        { href: "/responsible-gambling", label: t("legal.rgTitle") },
        { href: "/aml", label: t("legal.amlTitle") },
      ],
    },
  ];

  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Logo size={30} />
            <p className="mt-4 max-w-[340px] text-[13px] leading-relaxed text-mute">
              {t("footer.description")}
            </p>
            <div className="mt-5">
              <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-mute">
                {t("footer.payments")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {COINS.map((c) => (
                  <CoinIcon key={c.symbol} symbol={c.symbol} size={22} />
                ))}
              </div>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-[12px] font-extrabold uppercase tracking-wider text-sub">
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((l, i) => (
                  <li key={l.label + i}>
                    <Link
                      href={l.href}
                      className="text-[13px] font-semibold text-mute transition-colors hover:text-em"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/*
          LICENSE_INFO_PLACEHOLDER
          TODO(license): после получения лицензии заменить блок ниже на
          официальный номер лицензии, наименование регулятора и валидатор-виджет.
        */}
        <div className="mt-10 rounded-xl border border-dashed border-line2 px-5 py-4">
          <p className="text-[12px] leading-relaxed text-mute">{t("footer.license")}</p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
          <p className="text-[12.5px] font-semibold text-mute">
            {t("footer.copyright", { year })}
          </p>
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-10 items-center justify-center rounded-lg border border-line2 text-[12px] font-extrabold text-sub">
              18+
            </span>
            <Link
              href="/responsible-gambling"
              className="text-[12.5px] font-bold text-mute transition-colors hover:text-em"
            >
              {t("footer.responsible")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
