"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GameCard } from "@/components/casino/GameCard";
import { useI18n } from "@/lib/i18n/provider";
import type { Game } from "@/lib/data/games";

export function GameRow({
  title,
  icon,
  games,
  href,
}: {
  title: string;
  icon?: React.ReactNode;
  games: Game[];
  href?: string;
}) {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * (ref.current.clientWidth - 120), behavior: "smooth" });
  };

  return (
    <section className="mb-9">
      <div className="mb-3.5 flex items-center gap-3">
        {icon && <span className="text-em">{icon}</span>}
        <h2 className="text-[17px] font-extrabold tracking-tight sm:text-lg">{title}</h2>
        <div className="ml-auto flex items-center gap-1.5">
          {href && (
            <Link
              href={href}
              className="mr-1 text-[12.5px] font-bold text-sub transition-colors hover:text-em"
            >
              {t("common.seeAll")}
            </Link>
          )}
          <button
            onClick={() => scroll(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-card text-sub transition-colors hover:bg-raise hover:text-ink"
            aria-label="prev"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-card text-sub transition-colors hover:bg-raise hover:text-ink"
            aria-label="next"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div ref={ref} className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {games.map((g) => (
          <GameCard
            key={g.slug}
            game={g}
            className="w-[calc(33.4%-8px)] shrink-0 sm:w-[168px]"
          />
        ))}
      </div>
    </section>
  );
}
