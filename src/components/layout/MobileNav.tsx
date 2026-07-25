"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dices,
  Gem,
  Gift,
  Home,
  LifeBuoy,
  Menu,
  Search,
  Trophy,
  User,
  UserPlus,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/stores/auth";
import { useUi } from "@/lib/stores/ui";
import { useLockBody } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/** Нижняя навигация (mobile) + выезжающее меню */
export function MobileNav() {
  const { t } = useI18n();
  const pathname = usePathname();
  const user = useAuth((s) => s.user);
  const { mobileMenuOpen, setMobileMenu, openWallet, openAuth, openSearch } = useUi();
  useLockBody(mobileMenuOpen);

  const tabs = [
    { key: "menu", label: t("nav.menu"), icon: <Menu size={19} />, onClick: () => setMobileMenu(true) },
    { key: "casino", label: t("nav.casino"), icon: <Dices size={19} />, href: "/casino" },
    { key: "sports", label: t("nav.sports"), icon: <Trophy size={19} />, href: "/sports" },
    {
      key: "wallet",
      label: t("common.wallet"),
      icon: <Wallet size={19} />,
      onClick: () => (user ? openWallet("deposit") : openAuth("login")),
    },
    {
      key: "profile",
      label: t("common.profile"),
      icon: <User size={19} />,
      href: user ? "/profile" : undefined,
      onClick: user ? undefined : () => openAuth("login"),
    },
  ];

  const menuLinks = [
    { href: "/", icon: <Home size={18} />, label: t("common.home") },
    { href: "/casino", icon: <Dices size={18} />, label: t("nav.casino") },
    { href: "/sports", icon: <Trophy size={18} />, label: t("nav.sports") },
    { href: "/bonuses", icon: <Gift size={18} />, label: t("nav.bonuses") },
    { href: "/vip", icon: <Gem size={18} />, label: t("nav.vip") },
    { href: "/tournaments", icon: <Zap size={18} />, label: t("nav.tournaments") },
    { href: "/referral", icon: <UserPlus size={18} />, label: t("nav.referral") },
    { href: "/support", icon: <LifeBuoy size={18} />, label: t("common.support") },
  ];

  return (
    <>
      {/* bottom bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-panel/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
        <div className="grid grid-cols-5">
          {tabs.map((tab) => {
            const active = tab.href && pathname === tab.href;
            const cls = cn(
              "flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold transition-colors",
              active ? "text-em" : "text-mute hover:text-sub",
            );
            return tab.href ? (
              <Link key={tab.key} href={tab.href} className={cls}>
                {tab.icon}
                {tab.label}
              </Link>
            ) : (
              <button key={tab.key} onClick={tab.onClick} className={cls}>
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[90] lg:hidden">
            <motion.div
              className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenu(false)}
            />
            <motion.div
              className="absolute inset-y-0 left-0 flex w-[300px] max-w-[85vw] flex-col border-r border-line bg-panel"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
            >
              <div className="flex h-16 items-center justify-between border-b border-line px-4">
                <Logo size={26} />
                <button
                  onClick={() => setMobileMenu(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-[10px] text-mute hover:bg-raise hover:text-ink"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                {!user && (
                  <div className="mb-3 grid grid-cols-2 gap-2">
                    <Button variant="secondary" onClick={() => openAuth("login")}>
                      {t("common.login")}
                    </Button>
                    <Button onClick={() => openAuth("register")}>{t("common.register")}</Button>
                  </div>
                )}
                <button
                  onClick={() => {
                    openSearch();
                  }}
                  className="mb-3 flex h-11 w-full items-center gap-2.5 rounded-[10px] border border-line bg-field px-3.5 text-sm text-mute"
                >
                  <Search size={16} />
                  {t("common.searchGames")}
                </button>
                <div className="space-y-0.5">
                  {menuLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setMobileMenu(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14px] font-bold transition-colors",
                        pathname === l.href ? "bg-em/10 text-em" : "text-sub hover:bg-raise hover:text-ink",
                      )}
                    >
                      <span className={pathname === l.href ? "text-em" : "text-mute"}>{l.icon}</span>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-line px-4 py-3">
                <LanguageSwitcher up />
                <span className="flex h-7 w-9 items-center justify-center rounded-md border border-line2 text-[11px] font-extrabold text-sub">
                  18+
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
