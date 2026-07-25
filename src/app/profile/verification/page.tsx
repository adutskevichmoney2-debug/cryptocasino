"use client";

import { FileUp, IdCard, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

export default function VerificationPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="surface flex items-start gap-4 p-5 sm:p-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-warn/10 text-warn">
          <IdCard size={22} />
        </span>
        <div>
          <p className="flex flex-wrap items-center gap-2 text-[15px] font-extrabold">
            {t("profile.verification")}
            <span className="rounded-md bg-warn/15 px-2 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wide text-warn">
              {t("common.notVerified")}
            </span>
          </p>
          <p className="mt-1.5 max-w-[560px] text-[13px] leading-relaxed text-sub">
            {t("profile.kycHint")}
          </p>
        </div>
      </div>

      {/*
        ============================================================
        KYC_PROVIDER_EMBED — точка интеграции KYC-провайдера
        (Sumsub / Veriff / собственный флоу на Supabase Storage).
        TODO(backend): заменить блок ниже на виджет провайдера
        или форму загрузки с записью статусов верификации.
        ============================================================
      */}
      <div className="surface p-5 sm:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-[15px] font-extrabold tracking-tight">
          <ShieldCheck size={17} className="text-em" />
          {t("profile.kycZone")}
        </h2>
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line2 px-6 py-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-raise text-mute">
            <FileUp size={24} />
          </span>
          <p className="text-[14px] font-bold">{t("common.comingSoon")}</p>
          <p className="max-w-[460px] text-[12.5px] leading-relaxed text-mute">
            {t("profile.kycZoneHint")}
          </p>
        </div>
      </div>
    </div>
  );
}
