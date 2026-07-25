"use client";

import Image from "next/image";
import { useState } from "react";
import { BadgePercent, Gift, ShieldQuestion, TicketPercent } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/stores/auth";
import { useUi } from "@/lib/stores/ui";
import { PROMOS, VALID_PROMO_CODES } from "@/lib/data/promos";

function PromoRedeem() {
  const { t } = useI18n();
  const user = useAuth((s) => s.user);
  const { openAuth, toast } = useUi();
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);

  const redeem = () => {
    // TODO(backend): POST /promo/redeem — валидация кода на сервере
    if (!user) {
      toast("info", t("bonuses.loginToClaim"));
      openAuth("register");
      return;
    }
    const value = code.trim().toUpperCase();
    if (!value) return;
    if (VALID_PROMO_CODES.includes(value)) {
      setErr(false);
      setCode("");
      toast("success", t("common.success"), t("bonuses.promoOk"));
    } else {
      setErr(true);
      toast("error", t("common.error"), t("bonuses.promoInvalid"));
    }
  };

  return (
    <div className="surface mx-auto mt-10 flex max-w-[560px] flex-col items-center gap-3 p-6 text-center sm:p-7">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-em/10 text-em">
        <TicketPercent size={21} />
      </span>
      <h2 className="text-[17px] font-extrabold tracking-tight">{t("bonuses.promoTitle")}</h2>
      <div className="flex w-full max-w-[400px] gap-2">
        <input
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setErr(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && redeem()}
          placeholder={t("bonuses.promoPlaceholder")}
          className={`h-11 min-w-0 flex-1 rounded-[10px] border bg-field px-3.5 text-sm font-bold uppercase tracking-wide text-ink outline-none transition-colors placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-mute ${
            err ? "border-danger/70" : "border-line focus:border-em/70"
          }`}
        />
        <Button onClick={redeem} className="h-11 shrink-0">
          {t("bonuses.promoApply")}
        </Button>
      </div>
      {err && <p className="text-xs font-medium text-danger">{t("bonuses.promoInvalid")}</p>}
    </div>
  );
}

export default function BonusesPage() {
  const { t, dict } = useI18n();
  const user = useAuth((s) => s.user);
  const { openAuth, toast } = useUi();

  const claim = () => {
    // TODO(backend): активация бонуса через API (учёт вейджера, статусы)
    if (!user) {
      toast("info", t("bonuses.loginToClaim"));
      openAuth("register");
      return;
    }
    toast("success", t("common.success"), t("bonuses.activated"));
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-em/30 bg-em/10 px-3.5 py-1.5 text-[12px] font-extrabold text-em">
          <Gift size={13} />
          {t("nav.promotions")}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t("bonuses.title")}
        </h1>
        <p className="mx-auto mt-2.5 max-w-[440px] text-[14px] text-sub">{t("bonuses.subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PROMOS.map((p) => (
          <div key={p.id} className="surface lift group overflow-hidden">
            <div className="relative h-[170px] overflow-hidden">
              <Image
                src={p.img}
                alt={t(`bonuses.cards.${p.id}.title`)}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              <span
                className="absolute left-4 top-4 rounded-lg px-2.5 py-1 text-[15px] font-extrabold text-[#04281b]"
                style={{ background: p.accent }}
              >
                {p.badge}
              </span>
            </div>
            <div className="p-5">
              <h2 className="text-[17px] font-extrabold tracking-tight">
                {t(`bonuses.cards.${p.id}.title`)}
              </h2>
              <p className="mt-1.5 min-h-[40px] text-[13px] leading-relaxed text-sub">
                {t(`bonuses.cards.${p.id}.desc`)}
              </p>
              <div className="mt-3.5 flex flex-wrap gap-2">
                <span className="rounded-lg bg-field px-2.5 py-1.5 text-[11.5px] font-bold text-sub">
                  {t("bonuses.wager")}: <b className="text-ink">{p.wager}</b>
                </span>
                <span className="rounded-lg bg-field px-2.5 py-1.5 text-[11.5px] font-bold text-sub">
                  {t("bonuses.minDep")}: <b className="text-ink">{p.minDep}</b>
                </span>
              </div>
              <Button fullWidth className="mt-4" onClick={claim}>
                {t("bonuses.claim")}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <PromoRedeem />

      {/* how it works */}
      <div className="mt-12">
        <h2 className="mb-4 text-center text-xl font-extrabold tracking-tight">
          {t("bonuses.howTitle")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {dict.bonuses.how.map((s, i) => (
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

      <div className="mt-8 flex items-start gap-3 rounded-xl border border-line bg-panel px-4 py-3.5">
        <ShieldQuestion size={16} className="mt-0.5 shrink-0 text-mute" />
        <p className="text-[12px] leading-relaxed text-mute">
          {t("bonuses.termsNote")} <BadgePercent size={12} className="inline text-em" />
        </p>
      </div>
    </div>
  );
}
