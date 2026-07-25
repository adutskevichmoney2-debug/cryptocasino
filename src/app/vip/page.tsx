"use client";

import Image from "next/image";
import { Check, Gem, Minus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/misc";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/stores/auth";
import { useUi } from "@/lib/stores/ui";
import { useHasMounted } from "@/lib/hooks";
import { VIP_LEVELS } from "@/lib/data/vip";
import { formatFiat } from "@/lib/utils";

export default function VipPage() {
  const { t } = useI18n();
  const mounted = useHasMounted();
  const user = useAuth((s) => s.user);
  const { openAuth } = useUi();

  // TODO(backend): реальный оборот игрока приходит из API; пока честный ноль
  const wagered = 0;
  const current = VIP_LEVELS.filter((l) => wagered >= l.threshold).at(-1) ?? VIP_LEVELS[0];
  const next = VIP_LEVELS[VIP_LEVELS.indexOf(current) + 1];
  const progress = next ? (wagered / next.threshold) * 100 : 100;

  const perks = [
    { key: "cashback" as const, get: (l: (typeof VIP_LEVELS)[number]) => l.cashback },
    { key: "rakeback" as const, get: (l: (typeof VIP_LEVELS)[number]) => l.rakeback },
    { key: "levelUp" as const, get: (l: (typeof VIP_LEVELS)[number]) => l.levelUp },
    { key: "gifts" as const, get: (l: (typeof VIP_LEVELS)[number]) => l.gifts },
    { key: "priority" as const, get: (l: (typeof VIP_LEVELS)[number]) => l.priority },
    { key: "manager" as const, get: (l: (typeof VIP_LEVELS)[number]) => l.manager },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      {/* hero */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-line">
        <Image src="/images/vip.webp" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-page/95 via-page/75 to-page/30" />
        <div className="relative max-w-[560px] p-7 sm:p-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-em/30 bg-em/10 px-3.5 py-1.5 text-[12px] font-extrabold text-em">
            <Gem size={13} />
            VIP
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{t("vip.title")}</h1>
          <p className="mt-2.5 text-[14px] leading-relaxed text-sub">{t("vip.subtitle")}</p>
          {mounted && !user && (
            <Button size="lg" className="mt-6" onClick={() => openAuth("register")}>
              {t("vip.join")}
            </Button>
          )}
        </div>
      </div>

      {/* progress (for logged users) */}
      {mounted && user && (
        <div className="surface mb-8 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-mute">
                {t("vip.yourLevel")}
              </p>
              <p className="mt-1 flex items-center gap-2 text-xl font-extrabold" style={{ color: current.color }}>
                <Gem size={18} />
                {t(`vip.levels.${current.id}`)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold uppercase tracking-wider text-mute">
                {t("vip.wagered")}
              </p>
              <p className="tnum mt-1 text-xl font-extrabold">${formatFiat(wagered)}</p>
            </div>
          </div>
          {next && (
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-[12px] font-semibold text-mute">
                <span>{t("vip.toNext", { level: t(`vip.levels.${next.id}`) })}</span>
                <span className="tnum">
                  ${formatFiat(wagered)} / ${formatFiat(next.threshold)}
                </span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </div>
      )}

      {/* levels */}
      <div className="mb-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {VIP_LEVELS.map((l) => (
          <div key={l.id} className="surface lift p-5 text-center">
            <span
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ background: `${l.color}1f`, color: l.color }}
            >
              <Gem size={22} />
            </span>
            <p className="mt-3 text-[15px] font-extrabold" style={{ color: l.color }}>
              {t(`vip.levels.${l.id}`)}
            </p>
            <p className="tnum mt-1 text-[12px] font-semibold text-mute">
              {l.threshold === 0 ? "0" : `$${formatFiat(l.threshold, 0)}`}+
            </p>
            <div className="mt-3 space-y-1 text-[12px] font-semibold text-sub">
              <p>
                {t("vip.perkTable.cashback")}: <b className="text-ink">{l.cashback}</b>
              </p>
              <p>
                {t("vip.perkTable.rakeback")}: <b className="text-ink">{l.rakeback}</b>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* perks table */}
      <div className="surface overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-line text-[11px] font-extrabold uppercase tracking-wider text-mute">
              <th className="px-5 py-3.5"> </th>
              {VIP_LEVELS.map((l) => (
                <th key={l.id} className="px-4 py-3.5 text-center" style={{ color: l.color }}>
                  {t(`vip.levels.${l.id}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {perks.map((row) => (
              <tr key={row.key} className="border-b border-line/60 last:border-0">
                <td className="px-5 py-3 text-[13px] font-bold text-sub">
                  {t(`vip.perkTable.${row.key}`)}
                </td>
                {VIP_LEVELS.map((l) => {
                  const v = row.get(l);
                  return (
                    <td key={l.id} className="px-4 py-3 text-center text-[13px] font-bold">
                      {typeof v === "boolean" ? (
                        v ? (
                          <Check size={16} className="mx-auto text-em" />
                        ) : (
                          <Minus size={15} className="mx-auto text-mute/50" />
                        )
                      ) : (
                        <span className="tnum">{v}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-center text-[12px] text-mute">{t("vip.note")}</p>
    </div>
  );
}
