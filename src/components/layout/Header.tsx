"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Gift,
  History,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  Wallet as WalletIcon,
} from "lucide-react";
import { useState } from "react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { Dropdown } from "@/components/ui/Dropdown";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/stores/auth";
import { useWallet } from "@/lib/stores/wallet";
import { useUi } from "@/lib/stores/ui";
import { useHasMounted } from "@/lib/hooks";
import { COINS, coinBySymbol } from "@/lib/data/coins";
import { cn, formatAmount, formatFiat } from "@/lib/utils";

function BalanceModule() {
  const { t } = useI18n();
  const { balances, activeCoin, setActiveCoin, showFiat, toggleFiat } = useWallet();
  const openWallet = useUi((s) => s.openWallet);
  const coin = coinBySymbol(activeCoin)!;
  const balance = balances[activeCoin] ?? 0;

  return (
    <div className="flex items-stretch overflow-hidden rounded-[10px] border border-line bg-field">
      <Dropdown
        width="w-72"
        align="left"
        trigger={(open) => (
          <button className="flex h-10 items-center gap-2 px-3 transition-colors hover:bg-raise">
            <CoinIcon symbol={activeCoin} size={20} />
            <span className="tnum text-sm font-bold text-ink">
              {showFiat
                ? `$${formatFiat(balance * coin.usdRate)}`
                : formatAmount(balance, coin.decimals)}
            </span>
            <ChevronDown
              size={14}
              className={cn("text-mute transition-transform", open && "rotate-180")}
            />
          </button>
        )}
      >
        {(close) => (
          <div>
            <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-mute">
                {t("wallet.allAssets")}
              </span>
              <button
                onClick={toggleFiat}
                className={cn(
                  "rounded-md px-2 py-1 text-[11px] font-extrabold transition-colors",
                  showFiat ? "bg-em/15 text-em" : "bg-raise text-mute hover:text-sub",
                )}
              >
                USD
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto p-1.5">
              {COINS.map((c) => {
                const b = balances[c.symbol] ?? 0;
                return (
                  <button
                    key={c.symbol}
                    onClick={() => {
                      setActiveCoin(c.symbol);
                      close();
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-hover",
                      c.symbol === activeCoin && "bg-raise",
                    )}
                  >
                    <CoinIcon symbol={c.symbol} size={26} />
                    <span className="flex-1 text-left">
                      <span className="block text-[13px] font-bold leading-tight text-ink">
                        {c.symbol}
                      </span>
                      <span className="block text-[11px] leading-tight text-mute">{c.name}</span>
                    </span>
                    <span className="text-right">
                      <span className="tnum block text-[13px] font-bold leading-tight text-ink">
                        {formatAmount(b, c.decimals)}
                      </span>
                      <span className="tnum block text-[11px] leading-tight text-mute">
                        ${formatFiat(b * c.usdRate)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="border-t border-line p-1.5">
              <button
                onClick={() => {
                  openWallet("deposit");
                  close();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-bold text-em transition-colors hover:bg-hover"
              >
                <WalletIcon size={16} />
                {t("common.wallet")}
              </button>
            </div>
          </div>
        )}
      </Dropdown>
      <button
        onClick={() => openWallet("deposit")}
        className="hidden h-10 items-center bg-em px-4 text-sm font-bold text-[#04281b] transition-colors hover:bg-em-bright sm:flex"
      >
        {t("common.deposit")}
      </button>
    </div>
  );
}

function NotificationsBell() {
  const { t } = useI18n();
  const [read, setRead] = useState(false);

  return (
    <Dropdown
      width="w-80"
      trigger={(open) => (
        <button
          aria-label={t("common.notifications")}
          className={cn(
            "relative flex h-10 w-10 items-center justify-center rounded-[10px] text-sub transition-colors hover:bg-raise hover:text-ink",
            open && "bg-raise text-ink",
          )}
        >
          <Bell size={18} />
          {!read && (
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-em pulse-dot-em" />
          )}
        </button>
      )}
    >
      {() => (
        <div>
          <div className="border-b border-line px-4 py-3 text-sm font-extrabold">
            {t("common.notifications")}
          </div>
          {!read ? (
            <button
              onClick={() => setRead(true)}
              className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-hover"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-em/15 text-em">
                <Gift size={17} />
              </span>
              <span>
                <span className="block text-[13px] font-bold leading-snug text-ink">
                  {t("misc.notifWelcomeT")}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-sub">
                  {t("misc.notifWelcomeD")}
                </span>
              </span>
            </button>
          ) : (
            <p className="px-4 py-8 text-center text-[13px] text-mute">{t("misc.notifEmpty")}</p>
          )}
        </div>
      )}
    </Dropdown>
  );
}

function ProfileMenu() {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const { openWallet, toast } = useUi();
  if (!user) return null;

  const items = [
    { href: "/profile", icon: <User size={16} />, label: t("common.profile") },
    { onClick: () => openWallet("deposit"), icon: <WalletIcon size={16} />, label: t("common.wallet") },
    { onClick: () => openWallet("history"), icon: <History size={16} />, label: t("common.transactions") },
    { href: "/profile/settings", icon: <Settings size={16} />, label: t("common.settings") },
  ];

  return (
    <Dropdown
      width="w-60"
      trigger={(open) => (
        <button
          className={cn(
            "flex h-10 items-center gap-2 rounded-[10px] px-1.5 transition-colors hover:bg-raise",
            open && "bg-raise",
          )}
        >
          <Avatar username={user.username} src={user.avatar} size={30} />
          <ChevronDown size={14} className={cn("text-mute transition-transform", open && "rotate-180")} />
        </button>
      )}
    >
      {(close) => (
        <div>
          <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
            <Avatar username={user.username} src={user.avatar} size={38} />
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-ink">{user.username}</p>
              <p className="truncate text-xs text-mute">{user.email}</p>
            </div>
          </div>
          <div className="p-1.5">
            {items.map((it, i) =>
              it.href ? (
                <Link
                  key={i}
                  href={it.href}
                  onClick={close}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-semibold text-sub transition-colors hover:bg-hover hover:text-ink"
                >
                  {it.icon}
                  {it.label}
                </Link>
              ) : (
                <button
                  key={i}
                  onClick={() => {
                    it.onClick?.();
                    close();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-semibold text-sub transition-colors hover:bg-hover hover:text-ink"
                >
                  {it.icon}
                  {it.label}
                </button>
              ),
            )}
          </div>
          <div className="border-t border-line p-1.5">
            <button
              onClick={() => {
                logout();
                toast("info", t("auth.ok.loggedOut"));
                close();
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-semibold text-danger transition-colors hover:bg-danger/10"
            >
              <LogOut size={16} />
              {t("common.logout")}
            </button>
          </div>
        </div>
      )}
    </Dropdown>
  );
}

export function Header() {
  const { t } = useI18n();
  const mounted = useHasMounted();
  const user = useAuth((s) => s.user);
  const { openAuth, openSearch, setMobileMenu } = useUi();
  const pathname = usePathname();

  const nav = [
    { href: "/casino", label: t("nav.casino") },
    { href: "/sports", label: t("nav.sports") },
    { href: "/bonuses", label: t("nav.bonuses") },
    { href: "/tournaments", label: t("nav.tournaments") },
    { href: "/vip", label: t("nav.vip") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-panel/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-2 px-3 sm:px-5">
        {/* mobile: burger */}
        <button
          onClick={() => setMobileMenu(true)}
          className="flex h-10 w-10 items-center justify-center rounded-[10px] text-sub transition-colors hover:bg-raise hover:text-ink lg:hidden"
          aria-label={t("nav.menu")}
        >
          <Menu size={20} />
        </button>

        <Link href="/" className="mr-1 flex items-center" aria-label="CryptoCasino">
          <span className="hidden sm:block">
            <Logo size={30} />
          </span>
          <span className="sm:hidden">
            <LogoMark size={30} />
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "rounded-[10px] px-3 py-2 text-sm font-bold transition-colors",
                pathname.startsWith(n.href)
                  ? "bg-em/10 text-em"
                  : "text-sub hover:bg-raise hover:text-ink",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* center: balance (logged in) */}
        <div className="mx-auto flex items-center">
          {mounted && user && <BalanceModule />}
        </div>

        {/* right cluster */}
        <div className="flex items-center gap-1">
          <button
            onClick={openSearch}
            aria-label={t("common.search")}
            className="hidden h-10 w-10 items-center justify-center rounded-[10px] text-sub transition-colors hover:bg-raise hover:text-ink sm:flex"
          >
            <Search size={18} />
          </button>
          <span className="hidden md:block">
            <LanguageSwitcher />
          </span>

          {!mounted ? (
            <div className="h-10 w-36 animate-pulse rounded-[10px] bg-raise/60" />
          ) : user ? (
            <>
              <NotificationsBell />
              <ProfileMenu />
            </>
          ) : (
            <>
              <Button variant="ghost" size="md" onClick={() => openAuth("login")}>
                {t("common.login")}
              </Button>
              <Button size="md" onClick={() => openAuth("register")}>
                {t("common.register")}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
