"use client";

import { BadgeCheck, Gem, Receipt, TrendingUp } from "lucide-react";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/stores/auth";
import { useWallet } from "@/lib/stores/wallet";
import { formatDate, formatFiat } from "@/lib/utils";

export default function ProfileOverview() {
  const { t } = useI18n();
  const user = useAuth((s) => s.user);
  const transactions = useWallet((s) => s.transactions);
  if (!user) return null;

  const stats = [
    { icon: <Receipt size={18} />, label: t("profile.totalBets"), value: "0" },
    { icon: <TrendingUp size={18} />, label: t("profile.totalWagered"), value: `$${formatFiat(0)}` },
    { icon: <Gem size={18} />, label: t("common.level"), value: t("vip.levels.bronze") },
  ];

  return (
    <div className="space-y-4">
      {/* identity */}
      <div className="surface p-5 sm:p-6">
        <AvatarUpload />
        <div className="mt-5 grid gap-3 border-t border-line pt-5 sm:grid-cols-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-mute">
              {t("auth.username")}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-[15px] font-extrabold">
              {user.username}
              <BadgeCheck size={15} className="text-em" />
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-mute">
              {t("auth.email")}
            </p>
            <p className="mt-1 truncate text-[15px] font-extrabold">{user.email}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-mute">
              {t("profile.memberSince")}
            </p>
            <p className="tnum mt-1 text-[15px] font-extrabold">
              {formatDate(user.createdAt, false)}
            </p>
          </div>
        </div>
      </div>

      {/* stats — честные нули до реальной игры; TODO(backend): статистика из API */}
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="surface flex items-center gap-3.5 p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-em/10 text-em">
              {s.icon}
            </span>
            <span>
              <span className="tnum block text-[17px] font-extrabold leading-tight">{s.value}</span>
              <span className="block text-[12px] font-semibold text-mute">{s.label}</span>
            </span>
          </div>
        ))}
      </div>

      <p className="text-[12px] text-mute">
        {t("common.transactions")}: {transactions.length}
      </p>
    </div>
  );
}
