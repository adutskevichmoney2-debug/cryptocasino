"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronRight, Trophy } from "lucide-react";
import { OddsButton } from "@/components/sports/OddsButton";
import { BetslipCard, BetslipMobile } from "@/components/sports/Betslip";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/misc";
import { useI18n } from "@/lib/i18n/provider";
import { EVENTS, SPORTS, type MatchEvent, type SportId } from "@/lib/data/sports";
import { cn } from "@/lib/utils";

// Опорное время загрузки страницы — от него считаются мок-времена матчей.
// TODO(backend): реальные timestamp'ы приходят из фида провайдера.
const NOW = Date.now();

function EventRow({ event }: { event: MatchEvent }) {
  const { t } = useI18n();
  const startTs = NOW + event.startOffsetMin * 60_000;
  const live = event.startOffsetMin < 0;
  const d = new Date(startTs);
  const timeLabel = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="surface p-4 transition-colors hover:border-line2">
      <div className="mb-2.5 flex items-center gap-2 text-[11.5px] font-semibold text-mute">
        <span>{SPORTS.find((s) => s.id === event.sport)?.icon}</span>
        <span className="truncate">{event.league}</span>
        <span className="ml-auto shrink-0" suppressHydrationWarning>
          {live ? (
            <span className="flex items-center gap-1.5 font-extrabold text-danger">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-danger" />
              {event.liveClock}
            </span>
          ) : (
            <>
              {t("sports.starts")} {timeLabel}
            </>
          )}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[14.5px] font-bold leading-snug">{event.home}</p>
          <p className="truncate text-[14.5px] font-bold leading-snug">{event.away}</p>
        </div>
        {event.score && (
          <div className="tnum shrink-0 text-right text-[14.5px] font-extrabold leading-snug text-em">
            <p>{event.score[0]}</p>
            <p>{event.score[1]}</p>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <div className="flex min-w-0 flex-1 gap-1.5">
          <OddsButton event={event} market="p1" />
          {event.odds.x !== null && <OddsButton event={event} market="x" />}
          <OddsButton event={event} market="p2" />
        </div>
        <div className="hidden gap-1.5 sm:flex">
          <OddsButton event={event} market="over" compact />
          <OddsButton event={event} market="under" compact />
        </div>
        <span className="ml-auto hidden items-center gap-0.5 text-[11.5px] font-bold text-mute sm:flex">
          +{event.marketsCount} {t("sports.markets")}
          <ChevronRight size={13} />
        </span>
      </div>
    </div>
  );
}

export default function SportsPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<"live" | "upcoming">("live");
  const [sport, setSport] = useState<SportId | "all">("all");

  const events = useMemo(() => {
    let list = EVENTS.filter((e) => (tab === "live" ? e.startOffsetMin < 0 : e.startOffsetMin >= 0));
    if (sport !== "all") list = list.filter((e) => e.sport === sport);
    return list;
  }, [tab, sport]);

  const counts = useMemo(() => {
    const map = new Map<SportId, number>();
    EVENTS.forEach((e) => map.set(e.sport, (map.get(e.sport) ?? 0) + 1));
    return map;
  }, []);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
      {/* page header */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-line">
        <Image src="/images/sports-hero.webp" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-page/95 to-page/60" />
        <div className="relative flex items-center gap-4 p-6 sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-em/15 text-em">
            <Trophy size={24} />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{t("sports.title")}</h1>
            <p className="mt-1 text-[13px] text-sub">{t("home.sportsText")}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[220px_1fr_320px]">
        {/* sports list */}
        <aside className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:px-0">
          <button
            onClick={() => setSport("all")}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13.5px] font-bold transition-colors lg:w-full",
              sport === "all" ? "bg-em/10 text-em" : "bg-card text-sub hover:bg-raise hover:text-ink lg:bg-transparent",
            )}
          >
            <Trophy size={16} />
            {t("sports.allSports")}
            <span className="ml-auto hidden text-[11px] font-bold text-mute lg:inline">{EVENTS.length}</span>
          </button>
          {SPORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSport(s.id)}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13.5px] font-bold transition-colors lg:w-full",
                sport === s.id ? "bg-em/10 text-em" : "bg-card text-sub hover:bg-raise hover:text-ink lg:bg-transparent",
              )}
            >
              <span className="text-[15px] leading-none">{s.icon}</span>
              {t(`sports.sport.${s.id}`)}
              <span className="ml-auto hidden text-[11px] font-bold text-mute lg:inline">
                {counts.get(s.id) ?? 0}
              </span>
            </button>
          ))}
        </aside>

        {/* events */}
        <div>
          <Tabs<"live" | "upcoming">
            layoutId="sports-tabs"
            className="mb-4 max-w-[280px]"
            items={[
              { id: "live", label: t("sports.live") },
              { id: "upcoming", label: t("sports.upcoming") },
            ]}
            value={tab}
            onChange={setTab}
          />
          {events.length === 0 ? (
            <EmptyState title={t("common.nothingFound")} hint={t("common.nothingFoundHint")} />
          ) : (
            <div className="space-y-2.5">
              {events.map((e) => (
                <EventRow key={e.id} event={e} />
              ))}
            </div>
          )}

          {/*
            ============================================================
            SPORTS_PROVIDER_EMBED — точка интеграции спортивного провайдера.
            TODO(backend): заменить мок-события (lib/data/sports.ts) на живой
            фид коэффициентов или iframe-виджет букмекерского модуля.
            ============================================================
          */}
          <div className="mt-4 rounded-xl border border-dashed border-line2 px-4 py-3">
            <p className="text-[11.5px] leading-relaxed text-mute">{t("sports.providerZoneHint")}</p>
          </div>
        </div>

        {/* betslip */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <BetslipCard />
          </div>
        </aside>
      </div>

      <BetslipMobile />
    </div>
  );
}
