"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUser, History, Receipt, Settings, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/stores/auth";
import { useUi } from "@/lib/stores/ui";
import { useHasMounted } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const mounted = useHasMounted();
  const user = useAuth((s) => s.user);
  const { openAuth } = useUi();

  const tabs = [
    { href: "/profile", icon: <UserRound size={16} />, label: t("profile.overview") },
    { href: "/profile/settings", icon: <Settings size={16} />, label: t("common.settings") },
    { href: "/profile/verification", icon: <ShieldCheck size={16} />, label: t("profile.verification") },
    { href: "/profile/transactions", icon: <Receipt size={16} />, label: t("common.transactions") },
    { href: "/profile/bets", icon: <History size={16} />, label: t("profile.bets") },
  ];

  if (!mounted) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
        <div className="skeleton h-10 w-56" />
        <div className="skeleton mt-6 h-64 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-[1100px] flex-col items-center px-4 py-24 text-center sm:px-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-raise text-mute">
          <CircleUser size={30} />
        </span>
        <h1 className="mt-4 text-xl font-extrabold">{t("auth.welcomeBack")}</h1>
        <p className="mt-1.5 max-w-[300px] text-[13px] text-mute">{t("auth.welcomeBackHint")}</p>
        <div className="mt-5 flex gap-2.5">
          <Button onClick={() => openAuth("login")}>{t("common.login")}</Button>
          <Button variant="secondary" onClick={() => openAuth("register")}>
            {t("common.register")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-7 sm:px-6">
      <h1 className="mb-5 text-2xl font-extrabold tracking-tight sm:text-3xl">
        {t("profile.title")}
      </h1>
      <div className="no-scrollbar -mx-1 mb-6 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-[10px] px-3.5 py-2.5 text-[13px] font-bold transition-colors",
              pathname === tab.href
                ? "bg-em/10 text-em"
                : "border border-line bg-card text-sub hover:border-line2 hover:text-ink",
            )}
          >
            {tab.icon}
            {tab.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
