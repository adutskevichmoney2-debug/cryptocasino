"use client";

import { FileText, Info } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { LEGAL, type LegalId } from "@/lib/data/legal";
import { formatDate } from "@/lib/utils";

/** Общий шаблон юридической страницы. Контент — RU/EN (как у крупных площадок),
 *  для остальных локалей показывается EN с пометкой. */
export function LegalPage({ id }: { id: LegalId }) {
  const { t, locale } = useI18n();
  const doc = LEGAL[id];
  const lang: "ru" | "en" = locale === "ru" ? "ru" : "en";

  return (
    <div className="mx-auto max-w-[820px] px-4 py-10 sm:px-6">
      <div className="mb-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-em/10 text-em">
          <FileText size={22} />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {t(doc.titleKey)}
        </h1>
        <p className="tnum mt-2 text-[12.5px] font-semibold text-mute">
          {t("legal.lastUpdated")}: {formatDate(doc.updated, false)}
        </p>
        {locale !== "ru" && locale !== "en" && (
          <p className="mt-3 flex items-start gap-2 rounded-[10px] bg-field px-3.5 py-2.5 text-[12px] text-sub">
            <Info size={14} className="mt-0.5 shrink-0 text-info" />
            {t("legal.docNote")}
          </p>
        )}
      </div>

      <div className="space-y-8">
        {doc.sections.map((s) => (
          <section key={s.h.en}>
            <h2 className="mb-2.5 text-[16px] font-extrabold tracking-tight">{s.h[lang]}</h2>
            <div className="space-y-2.5">
              {s.body.map((p, i) => (
                <p key={i} className="text-[13.5px] leading-[1.75] text-sub">
                  {p[lang]}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
