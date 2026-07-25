"use client";

import { useState } from "react";
import { Crown, Trophy, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Countdown } from "@/components/ui/misc";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/stores/auth";
import { useUi } from "@/lib/stores/ui";
import { useHasMounted } from "@/lib/hooks";
import { TOURNAMENTS, type Tournament } from "@/lib/data/tournaments";
import { cn } from "@/lib/utils";

// Опорное время загрузки страницы для мок-таймеров турниров.
const NOW = Date.now();

function TournamentCard({ tt }: { tt: Tournament }) {
  const { t } = useI18n();
  const mounted = useHasMounted();
  const user = useAuth((s) => s.user);
  const { openAuth, toast } = useUi();
  const [joined, setJoined] = useState(false);
  const endsAt = NOW + tt.endsOffsetH * 3_600_000;

  const join = () => {
    // TODO(backend): участие в турнире фиксируется на бэкенде
    if (!user) {
      toast("info", t("tournaments.loginToJoin"));
      openAuth("login");
      return;
    }
    setJoined(true);
    toast("success", t("common.success"), t("tournaments.joined"));
  };

  const scopeLabel: Record<Tournament["scope"], string> = {
    slots: t("nav.slots"),
    live: t("nav.liveCasino"),
    originals: t("nav.originals"),
    all: t("common.all"),
  };

  return (
    <div className="surface overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_1.1fr]">
        {/* info */}
        <div className="border-b border-line p-6 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-em/10 text-em">
              <Zap size={19} />
            </span>
            <span className="rounded-lg bg-field px-2.5 py-1 text-[11.5px] font-bold text-sub">
              {scopeLabel[tt.scope]}
            </span>
          </div>
          <h2 className="mt-4 text-xl font-extrabold tracking-tight">{tt.title}</h2>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-field px-4 py-3">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-mute">
                {t("tournaments.prizePool")}
              </p>
              <p className="tnum mt-0.5 text-[16px] font-extrabold text-em">{tt.prizePool}</p>
            </div>
            <div className="rounded-xl bg-field px-4 py-3">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-mute">
                {t("tournaments.endsIn")}
              </p>
              {mounted ? (
                <Countdown target={endsAt} className="mt-0.5" />
              ) : (
                <span className="mt-0.5 block h-5 w-20 animate-pulse rounded bg-raise" />
              )}
            </div>
          </div>

          <p className="mt-3.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-mute">
            <Users size={14} />
            <span className="tnum">{tt.participants.toLocaleString("ru-RU")}</span>{" "}
            {t("tournaments.participants")}
          </p>

          <Button fullWidth className="mt-5" onClick={join} disabled={joined} variant={joined ? "secondary" : "primary"}>
            {joined ? t("common.success") : t("tournaments.join")}
          </Button>
        </div>

        {/* leaderboard */}
        <div className="p-6">
          <p className="mb-3 flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-wider text-mute">
            <Trophy size={14} className="text-warn" />
            {t("tournaments.leaderboard")}
          </p>
          <div className="space-y-1">
            {tt.leaderboard.slice(0, 7).map((row) => (
              <div
                key={row.rank}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2",
                  row.rank <= 3 ? "bg-field" : "",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11.5px] font-extrabold",
                    row.rank === 1 && "bg-warn/20 text-warn",
                    row.rank === 2 && "bg-sub/20 text-sub",
                    row.rank === 3 && "bg-[#B9804A]/20 text-[#B9804A]",
                    row.rank > 3 && "text-mute",
                  )}
                >
                  {row.rank === 1 ? <Crown size={13} /> : row.rank}
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-bold">{row.player}</span>
                <span className="tnum hidden text-[12px] font-semibold text-mute sm:block">
                  {row.points.toLocaleString("ru-RU")} {t("tournaments.points").toLowerCase()}
                </span>
                <span className="tnum text-[12.5px] font-extrabold text-em">{row.prize}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TournamentsPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-em/30 bg-em/10 px-3.5 py-1.5 text-[12px] font-extrabold text-em">
          <Zap size={13} />
          {t("tournaments.active")}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t("tournaments.title")}
        </h1>
        <p className="mx-auto mt-2.5 max-w-[420px] text-[14px] text-sub">
          {t("tournaments.subtitle")}
        </p>
      </div>

      <div className="space-y-5">
        {TOURNAMENTS.map((tt) => (
          <TournamentCard key={tt.id} tt={tt} />
        ))}
      </div>

      {/* TODO(backend): реальные турниры и лидерборды приходят из API (lib/data/tournaments.ts — мок) */}
    </div>
  );
}
