"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { AtSign, KeyRound, Mail, TicketPercent, User } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/stores/auth";
import { useUi, type AuthTab } from "@/lib/stores/ui";
import { EMAIL_RE, USERNAME_RE, cn, passwordStrength } from "@/lib/utils";

/* ============ Регистрация ============ */

interface RegisterForm {
  email: string;
  username: string;
  password: string;
  confirm: string;
  promo?: string;
  terms: boolean;
}

function RegisterPane({ done }: { done: () => void }) {
  const { t } = useI18n();
  const { register: signUp } = useAuth();
  const toast = useUi((s) => s.toast);
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ mode: "onTouched" });

  const pw = watch("password") || "";
  const strength = passwordStrength(pw);
  const strengthLabel = [t("auth.strength.weak"), t("auth.strength.weak"), t("auth.strength.medium"), t("auth.strength.strong")][strength];
  const strengthColor = ["bg-danger", "bg-danger", "bg-warn", "bg-em"][strength];

  const onSubmit = handleSubmit(async (data) => {
    const res = await signUp({
      email: data.email.trim(),
      username: data.username.trim(),
      password: data.password,
    });
    if (!res.ok) {
      // серверная (мок) ошибка → показываем и в поле, и маленьким окном-тостом
      const msg = t(res.code);
      if (res.code.includes("email")) setError("email", { message: msg });
      else if (res.code.includes("username")) setError("username", { message: msg });
      else setError("root", { message: msg });
      toast("error", t("common.error"), msg);
      return;
    }
    toast("success", t("auth.ok.registered"));
    done();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3.5" noValidate>
      <Input
        label={t("auth.email")}
        type="email"
        placeholder="you@example.com"
        left={<Mail size={16} />}
        autoComplete="email"
        error={errors.email?.message}
        {...register("email", {
          required: t("auth.err.emailInvalid"),
          pattern: { value: EMAIL_RE, message: t("auth.err.emailInvalid") },
        })}
      />
      <Input
        label={t("auth.username")}
        placeholder="player_one"
        left={<User size={16} />}
        autoComplete="username"
        error={errors.username?.message}
        {...register("username", {
          required: t("auth.err.usernameInvalid"),
          pattern: { value: USERNAME_RE, message: t("auth.err.usernameInvalid") },
        })}
      />
      <div>
        <Input
          label={t("auth.password")}
          type="password"
          placeholder="••••••••"
          left={<KeyRound size={16} />}
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password", {
            required: t("auth.err.passwordShort"),
            minLength: { value: 8, message: t("auth.err.passwordShort") },
          })}
        />
        {pw.length > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex h-1 flex-1 gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={cn("h-full flex-1 rounded-full bg-raise transition-colors", i < strength && strengthColor)}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-mute">{strengthLabel}</span>
          </div>
        )}
      </div>
      <Input
        label={t("auth.confirmPassword")}
        type="password"
        placeholder="••••••••"
        left={<KeyRound size={16} />}
        autoComplete="new-password"
        error={errors.confirm?.message}
        {...register("confirm", {
          validate: (v) => v === pw || t("auth.err.passwordMismatch"),
        })}
      />
      <Input
        label={`${t("auth.promo")} (${t("common.optional")})`}
        placeholder={t("auth.promoPlaceholder")}
        left={<TicketPercent size={16} />}
        {...register("promo")}
      />

      <label className="flex cursor-pointer items-start gap-2.5 pt-1">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border border-line2 bg-field transition-colors checked:border-em checked:bg-em"
          {...register("terms", { required: true })}
        />
        <span className="text-[12.5px] leading-snug text-sub">
          {t("auth.agree1")}{" "}
          <a href="/terms" target="_blank" className="font-bold text-em hover:underline">
            {t("auth.agreeTerms")}
          </a>{" "}
          {t("auth.agreeAnd")}{" "}
          <a href="/privacy" target="_blank" className="font-bold text-em hover:underline">
            {t("auth.agreePrivacy")}
          </a>
        </span>
      </label>
      {errors.terms && (
        <p className="text-xs font-medium text-danger">{t("auth.err.termsRequired")}</p>
      )}
      {errors.root && <p className="text-xs font-medium text-danger">{errors.root.message}</p>}

      <Button type="submit" fullWidth size="lg" loading={isSubmitting} className="!mt-5">
        {t("auth.signUp")}
      </Button>
    </form>
  );
}

/* ============ Вход ============ */

interface LoginForm {
  email: string;
  password: string;
}

function LoginPane({ done, toReset }: { done: () => void; toReset: () => void }) {
  const { t } = useI18n();
  const { login } = useAuth();
  const toast = useUi((s) => s.toast);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ mode: "onTouched" });

  const onSubmit = handleSubmit(async (data) => {
    const res = await login({ email: data.email.trim(), password: data.password });
    if (!res.ok) {
      const msg = t(res.code);
      setError("root", { message: msg });
      toast("error", t("common.error"), msg);
      return;
    }
    toast("success", t("auth.ok.loggedIn"));
    done();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3.5" noValidate>
      <Input
        label={t("auth.email")}
        type="email"
        placeholder="you@example.com"
        left={<Mail size={16} />}
        autoComplete="email"
        error={errors.email?.message}
        {...register("email", {
          required: t("auth.err.emailInvalid"),
          pattern: { value: EMAIL_RE, message: t("auth.err.emailInvalid") },
        })}
      />
      <div>
        <Input
          label={t("auth.password")}
          type="password"
          placeholder="••••••••"
          left={<KeyRound size={16} />}
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password", { required: t("auth.err.passwordShort") })}
        />
        <button
          type="button"
          onClick={toReset}
          className="mt-2 text-[12.5px] font-bold text-em hover:underline"
        >
          {t("auth.forgot")}
        </button>
      </div>
      {errors.root && <p className="text-xs font-medium text-danger">{errors.root.message}</p>}
      <Button type="submit" fullWidth size="lg" loading={isSubmitting} className="!mt-5">
        {t("auth.signIn")}
      </Button>
    </form>
  );
}

/* ============ Восстановление ============ */

function ResetPane() {
  const { t } = useI18n();
  const toast = useUi((s) => s.toast);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>({ mode: "onTouched" });

  // TODO(backend): supabase.auth.resetPasswordForEmail(email)
  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 500));
    setSent(true);
    toast("info", t("auth.resetSent"));
  });

  if (sent) {
    return (
      <div className="py-6 text-center">
        <AtSign size={34} className="mx-auto mb-3 text-em" />
        <p className="text-sm font-semibold text-sub">{t("auth.resetSent")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <p className="text-[13px] leading-relaxed text-sub">{t("auth.resetHint")}</p>
      <Input
        label={t("auth.email")}
        type="email"
        placeholder="you@example.com"
        left={<Mail size={16} />}
        error={errors.email?.message}
        {...register("email", {
          required: t("auth.err.emailInvalid"),
          pattern: { value: EMAIL_RE, message: t("auth.err.emailInvalid") },
        })}
      />
      <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
        {t("auth.resetCta")}
      </Button>
    </form>
  );
}

/* ============ Модалка ============ */

export function AuthModal() {
  const { modal, authTab, closeModal } = useUi();
  const open = modal === "auth";

  return (
    <Modal open={open} onClose={closeModal} size="sm" noPadding>
      {/* key={authTab}: содержимое монтируется заново при открытии с нужной вкладкой */}
      <AuthBody key={authTab} initial={authTab} />
    </Modal>
  );
}

function AuthBody({ initial }: { initial: AuthTab }) {
  const { t } = useI18n();
  const { closeModal, openAuth } = useUi();
  const [tab, setTab] = useState<AuthTab>(initial);

  return (
    <div className="px-6 pb-6 pt-8">
        <div className="mb-5 flex flex-col items-center text-center">
          <LogoMark size={44} />
          <h2 className="mt-3 text-xl font-extrabold tracking-tight">
            {tab === "login" && t("auth.welcomeBack")}
            {tab === "register" && t("auth.createAccount")}
            {tab === "reset" && t("auth.reset")}
          </h2>
          <p className="mt-1 text-[13px] text-mute">
            {tab === "login" && t("auth.welcomeBackHint")}
            {tab === "register" && t("auth.createAccountHint")}
          </p>
        </div>

        {tab !== "reset" && (
          <Tabs<Exclude<AuthTab, "reset">>
            layoutId="auth-tabs"
            className="mb-5"
            items={[
              { id: "login", label: t("common.login") },
              { id: "register", label: t("common.register") },
            ]}
            value={tab as Exclude<AuthTab, "reset">}
            onChange={(v) => setTab(v)}
          />
        )}

        {tab === "login" && <LoginPane done={closeModal} toReset={() => setTab("reset")} />}
        {tab === "register" && <RegisterPane done={closeModal} />}
        {tab === "reset" && <ResetPane />}

        <p className="mt-5 text-center text-[12.5px] font-semibold text-mute">
          {tab === "register" ? (
            <>
              {t("auth.haveAccount")}{" "}
              <button className="font-bold text-em hover:underline" onClick={() => openAuth("login")}>
                {t("auth.signIn")}
              </button>
            </>
          ) : (
            <>
              {t("auth.noAccount")}{" "}
              <button className="font-bold text-em hover:underline" onClick={() => openAuth("register")}>
                {t("auth.signUp")}
              </button>
            </>
          )}
        </p>
    </div>
  );
}
