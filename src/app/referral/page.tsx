"use client";

import { Link2, Share2, UserPlus, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/misc";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/stores/auth";
import { useUi } from "@/lib/stores/ui";
import { useHasMounted } from "@/lib/hooks";

export default function ReferralPage() {
  const { t, dict } = useI18n();
  const mounted = useHasMounted();
  const user = useAuth((s) => s.user);
  const { openAuth } = useUi();

  // TODO(backend): реферальные коды/статистика — из API
  const refLink = user ? `https://cryptocasino.app/?ref=${user.username}` : "";

  const stats = [
    { icon: <Users size={18} />, label: t("referral.referrals"), value: "0" },
    { icon: <Wallet size={18} />, label: t("referral.earned"), value: "$0.00" },
    { icon: <Share2 size={18} />, label: t("referral.commission"), value: "40%" },
  ];

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-8 sm:px-6">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-em/30 bg-em/10 px-3.5 py-1.5 text-[12px] font-extrabold text-em">
          <UserPlus size={13} />
          {t("nav.referral")}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t("referral.title")}
        </h1>
        <p className="mx-auto mt-2.5 max-w-[440px] text-[14px] text-sub">{t("referral.subtitle")}</p>
      </div>

      {/* link */}
      <div className="surface mx-auto max-w-[640px] p-5 sm:p-6">
        <p className="mb-2 text-[13px] font-semibold text-sub">{t("referral.yourLink")}</p>
        {mounted && user ? (
          <div className="flex items-center gap-2">
            <div className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-[10px] border border-line bg-field px-3.5">
              <Link2 size={15} className="shrink-0 text-em" />
              <span className="truncate text-[13.5px] font-bold text-ink">{refLink}</span>
            </div>
            <CopyButton value={refLink} className="h-11 w-11 rounded-[10px] border border-line bg-field" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-[10px] border border-dashed border-line2 px-4 py-6 text-center">
            <p className="text-[13px] text-mute">{t("referral.loginForLink")}</p>
            <Button size="sm" onClick={() => openAuth("register")}>
              {t("common.register")}
            </Button>
          </div>
        )}
      </div>

      {/* stats */}
      <div className="mx-auto mt-4 grid max-w-[640px] grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="surface p-4 text-center">
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-em/10 text-em">
              {s.icon}
            </span>
            <p className="tnum mt-2.5 text-lg font-extrabold">{s.value}</p>
            <p className="text-[11.5px] font-semibold text-mute">{s.label}</p>
          </div>
        ))}
      </div>

      {/* how */}
      <div className="mt-12">
        <h2 className="mb-4 text-center text-xl font-extrabold tracking-tight">
          {t("referral.howTitle")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {dict.referral.how.map((s, i) => (
            <div key={s.t} className="surface relative p-5 pt-6 text-center">
              <span className="absolute left-1/2 top-0 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-em text-[13px] font-extrabold text-[#04281b]">
                {i + 1}
              </span>
              <p className="text-[14.5px] font-extrabold">{s.t}</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-mute">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
