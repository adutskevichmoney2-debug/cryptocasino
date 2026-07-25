"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyRound, Laptop, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/misc";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/stores/auth";
import { usePrefs } from "@/lib/stores/prefs";
import { useUi } from "@/lib/stores/ui";
import { cn } from "@/lib/utils";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="surface p-5 sm:p-6">
      <h2 className="mb-4 text-[15px] font-extrabold tracking-tight">{title}</h2>
      {children}
    </div>
  );
}

interface PwForm {
  current: string;
  next: string;
  confirm: string;
}

export default function SettingsPage() {
  const { t } = useI18n();
  const { changePassword } = useAuth();
  const { hideStats, setHideStats, oddsFormat, setOddsFormat } = usePrefs();
  const toast = useUi((s) => s.toast);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<PwForm>({ mode: "onTouched" });

  const onChangePassword = handleSubmit(async (data) => {
    setSaving(true);
    const res = await changePassword(data.current, data.next);
    setSaving(false);
    if (!res.ok) {
      const msg = t(res.code);
      if (res.code === "profile.wrongPassword") setError("current", { message: msg });
      else setError("next", { message: msg });
      toast("error", t("common.error"), msg);
      return;
    }
    toast("success", t("profile.passwordChanged"));
    reset();
  });

  return (
    <div className="space-y-4">
      {/* password */}
      <Section title={t("profile.changePassword")}>
        <form onSubmit={onChangePassword} className="grid gap-3.5 sm:max-w-[420px]" noValidate>
          <Input
            label={t("profile.currentPassword")}
            type="password"
            left={<KeyRound size={16} />}
            autoComplete="current-password"
            error={errors.current?.message}
            {...register("current", { required: t("auth.err.passwordShort") })}
          />
          <Input
            label={t("profile.newPassword")}
            type="password"
            left={<KeyRound size={16} />}
            autoComplete="new-password"
            error={errors.next?.message}
            {...register("next", {
              required: t("auth.err.passwordShort"),
              minLength: { value: 8, message: t("auth.err.passwordShort") },
            })}
          />
          <Input
            label={t("auth.confirmPassword")}
            type="password"
            left={<KeyRound size={16} />}
            autoComplete="new-password"
            error={errors.confirm?.message}
            {...register("confirm", {
              validate: (v) => v === watch("next") || t("auth.err.passwordMismatch"),
            })}
          />
          <Button type="submit" loading={saving} className="w-fit">
            {t("common.save")}
          </Button>
        </form>
      </Section>

      {/* security */}
      <Section title={t("profile.security")}>
        <div className="flex flex-col gap-4">
          {/*
            TWO_FA_PLACEHOLDER — TODO(backend): Supabase Auth MFA (TOTP).
            Тумблер намеренно заблокирован до подключения бэкенда.
          */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[14px] font-bold">
                <ShieldCheck size={16} className="text-em" />
                {t("profile.twoFa")}
                <span className="rounded-md bg-raise px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-mute">
                  {t("common.comingSoon")}
                </span>
              </p>
              <p className="mt-1 max-w-[440px] text-[12.5px] leading-relaxed text-mute">
                {t("profile.twoFaHint")}
              </p>
            </div>
            <Switch checked={false} onChange={() => {}} disabled />
          </div>

          <div className="border-t border-line pt-4">
            <p className="mb-2.5 text-[13px] font-bold text-sub">{t("profile.sessions")}</p>
            <div className="flex items-center gap-3 rounded-[10px] bg-field px-3.5 py-3">
              <Laptop size={17} className="text-em" />
              <div className="flex-1">
                <p className="text-[13px] font-bold">{t("profile.currentSession")}</p>
                <p className="text-[11.5px] text-mute" suppressHydrationWarning>
                  {typeof navigator !== "undefined" ? navigator.platform || "Web" : "Web"} ·{" "}
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <span className="pulse-dot-em h-2 w-2 rounded-full bg-em" />
            </div>
          </div>
        </div>
      </Section>

      {/* privacy */}
      <Section title={t("profile.privacy")}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[14px] font-bold">{t("profile.hideStats")}</p>
            <p className="mt-1 text-[12.5px] text-mute">{t("profile.hideStatsHint")}</p>
          </div>
          <Switch
            checked={hideStats}
            onChange={(v) => {
              setHideStats(v);
              toast("success", t("profile.saved"));
            }}
          />
        </div>
      </Section>

      {/* preferences */}
      <Section title={t("profile.preferences")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[13px] font-semibold text-sub">{t("profile.oddsFormat")}</p>
            <div className="flex gap-2">
              {(["decimal", "american"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setOddsFormat(f);
                    toast("success", t("profile.saved"));
                  }}
                  className={cn(
                    "rounded-[10px] border px-4 py-2.5 text-[13px] font-bold transition-colors",
                    oddsFormat === f
                      ? "border-em/60 bg-em/10 text-em"
                      : "border-line bg-field text-sub hover:border-line2",
                  )}
                >
                  {f === "decimal" ? "1.85" : "-118"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[13px] font-semibold text-sub">{t("common.language")}</p>
            <LanguageSwitcher />
          </div>
        </div>
      </Section>
    </div>
  );
}
