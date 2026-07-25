"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  Club,
  Dice5,
  Dices,
  Gem,
  Gift,
  Heart,
  Layers,
  LifeBuoy,
  PanelLeftClose,
  PanelLeftOpen,
  Radio,
  ScrollText,
  Shield,
  Sparkles,
  Trophy,
  Tv,
  UserPlus,
  Zap,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { useUi } from "@/lib/stores/ui";
import { cn } from "@/lib/utils";

interface Item {
  href: string;
  icon: React.ReactNode;
  label: string;
  match?: (path: string, query: string | null) => boolean;
}

function SidebarInner() {
  const { t } = useI18n();
  const { sidebarCollapsed, toggleSidebar } = useUi();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cat = searchParams.get("cat");

  const groups: { title: string; items: Item[] }[] = [
    {
      title: t("nav.menu"),
      items: [
        { href: "/casino", icon: <Dices size={18} />, label: t("nav.casino"), match: (p, q) => p === "/casino" && !q },
        { href: "/sports", icon: <Trophy size={18} />, label: t("nav.sports"), match: (p) => p.startsWith("/sports") },
        { href: "/bonuses", icon: <Gift size={18} />, label: t("nav.bonuses"), match: (p) => p.startsWith("/bonuses") },
        { href: "/vip", icon: <Gem size={18} />, label: t("nav.vip"), match: (p) => p.startsWith("/vip") },
        { href: "/tournaments", icon: <Zap size={18} />, label: t("nav.tournaments"), match: (p) => p.startsWith("/tournaments") },
        { href: "/referral", icon: <UserPlus size={18} />, label: t("nav.referral"), match: (p) => p.startsWith("/referral") },
      ],
    },
    {
      title: t("nav.casino"),
      items: [
        { href: "/casino?cat=slots", icon: <Sparkles size={18} />, label: t("nav.slots"), match: (p, q) => p === "/casino" && q === "slots" },
        { href: "/casino?cat=live", icon: <Radio size={18} />, label: t("nav.liveCasino"), match: (p, q) => p === "/casino" && q === "live" },
        { href: "/casino?cat=game-shows", icon: <Tv size={18} />, label: t("nav.gameShows"), match: (p, q) => p === "/casino" && q === "game-shows" },
        { href: "/casino?cat=table", icon: <Club size={18} />, label: t("nav.tableGames"), match: (p, q) => p === "/casino" && q === "table" },
        { href: "/casino?cat=originals", icon: <Dice5 size={18} />, label: t("nav.originals"), match: (p, q) => p === "/casino" && q === "originals" },
        { href: "/casino?cat=favorites", icon: <Heart size={18} />, label: t("common.favorites"), match: (p, q) => p === "/casino" && q === "favorites" },
        { href: "/providers", icon: <Layers size={18} />, label: t("nav.providers"), match: (p) => p.startsWith("/providers") },
      ],
    },
    {
      title: t("common.support"),
      items: [
        { href: "/support", icon: <LifeBuoy size={18} />, label: t("common.support"), match: (p) => p.startsWith("/support") },
        { href: "/fairness", icon: <Shield size={18} />, label: t("legal.fairnessTitle"), match: (p) => p.startsWith("/fairness") },
        { href: "/responsible-gambling", icon: <ScrollText size={18} />, label: t("legal.rgTitle"), match: (p) => p.startsWith("/responsible-gambling") },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-line bg-panel transition-[width] duration-300 lg:flex",
        sidebarCollapsed ? "w-[68px]" : "w-[240px]",
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center gap-2 border-b border-line",
          sidebarCollapsed ? "justify-center px-0" : "px-3",
        )}
      >
        {/* быстрые вкладки, как у крупных проектов: Казино / Спорт */}
        {!sidebarCollapsed && (
          <>
            <Link
              href="/casino"
              className={cn(
                "flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] border text-[13px] font-extrabold transition-colors",
                pathname.startsWith("/casino")
                  ? "border-em/40 bg-em/10 text-em"
                  : "border-line bg-card text-sub hover:border-line2 hover:text-ink",
              )}
            >
              <Dices size={15} />
              {t("nav.casino")}
            </Link>
            <Link
              href="/sports"
              className={cn(
                "flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] border text-[13px] font-extrabold transition-colors",
                pathname.startsWith("/sports")
                  ? "border-em/40 bg-em/10 text-em"
                  : "border-line bg-card text-sub hover:border-line2 hover:text-ink",
              )}
            >
              <Trophy size={15} />
              {t("nav.sports")}
            </Link>
          </>
        )}
        <button
          onClick={toggleSidebar}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-mute transition-colors hover:bg-raise hover:text-ink"
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-3">
        {groups.map((g) => (
          <div key={g.title} className="mb-4">
            {!sidebarCollapsed && (
              <p className="mb-1.5 px-2.5 text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-mute">
                {g.title}
              </p>
            )}
            <div className="space-y-0.5">
              {g.items.map((it) => {
                const active = it.match ? it.match(pathname, cat) : pathname === it.href;
                return (
                  <Link
                    key={it.href + it.label}
                    href={it.href}
                    title={sidebarCollapsed ? it.label : undefined}
                    className={cn(
                      "group flex items-center gap-3 rounded-[10px] px-2.5 py-2 text-[13.5px] font-bold transition-colors",
                      sidebarCollapsed && "justify-center px-0",
                      active
                        ? "bg-em/10 text-em"
                        : "text-sub hover:bg-raise hover:text-ink",
                    )}
                  >
                    <span className={cn("shrink-0", active ? "text-em" : "text-mute group-hover:text-ink")}>
                      {it.icon}
                    </span>
                    {!sidebarCollapsed && <span className="truncate">{it.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {!sidebarCollapsed && (
        <div className="shrink-0 border-t border-line px-4 py-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-mute">
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-line2 text-[10px] font-extrabold text-sub">
              18+
            </span>
            {t("footer.responsible")}
          </div>
        </div>
      )}
    </aside>
  );
}

export function Sidebar() {
  return (
    <Suspense fallback={null}>
      <SidebarInner />
    </Suspense>
  );
}
