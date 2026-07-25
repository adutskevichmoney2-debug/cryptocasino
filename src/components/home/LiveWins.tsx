"use client";

import Image from "next/image";
import Link from "next/link";
import { Activity } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { DEMO_WINS } from "@/lib/data/wins";
import { gameBySlug, gameImg } from "@/lib/data/games";

/**
 * Лента выигрышей. Сейчас данные из lib/data/wins.ts.
 * TODO(backend): заменить на реальный фид ставок через Supabase Realtime / WS.
 */
export function LiveWins() {
  const { t } = useI18n();
  const doubled = [...DEMO_WINS, ...DEMO_WINS];

  return (
    <section className="mb-10">
      <div className="mb-3 flex items-center gap-2.5">
        <Activity size={18} className="text-em" />
        <h2 className="text-[15px] font-extrabold tracking-tight sm:text-base">
          {t("home.liveWins")}
        </h2>
      </div>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-page to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-page to-transparent" />
        <div className="marquee-track flex w-max gap-2.5">
          {doubled.map((w, i) => {
            const game = gameBySlug(w.gameSlug);
            return (
              <Link
                key={i}
                href={`/casino/game/${w.gameSlug}`}
                className="flex shrink-0 items-center gap-2.5 rounded-xl border border-line bg-card px-3 py-2 transition-colors hover:border-line2 hover:bg-raise"
              >
                <Image
                  src={gameImg(w.gameSlug)}
                  alt={game?.title ?? w.gameSlug}
                  width={34}
                  height={34}
                  className="h-[34px] w-[34px] rounded-lg object-cover"
                />
                <span>
                  <span className="block text-[11px] font-semibold leading-tight text-mute">
                    {w.player}
                  </span>
                  <span className="block text-[12px] font-extrabold leading-tight text-em">
                    {w.multiplier}
                    <span className="ml-1.5 text-ink">
                      {w.amount} {w.coin}
                    </span>
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
