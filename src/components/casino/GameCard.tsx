"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Play } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n/provider";
import { usePrefs } from "@/lib/stores/prefs";
import { useHasMounted } from "@/lib/hooks";
import { gameImg, type Game } from "@/lib/data/games";
import { cn } from "@/lib/utils";

export function GameCard({
  game,
  className,
  onNavigate,
}: {
  game: Game;
  className?: string;
  onNavigate?: () => void;
}) {
  const { t } = useI18n();
  const mounted = useHasMounted();
  const { favorites, toggleFavorite } = usePrefs();
  const fav = mounted && favorites.includes(game.slug);
  const tag = game.tags?.[0];

  return (
    <Link
      href={`/casino/game/${game.slug}`}
      onClick={onNavigate}
      className={cn(
        "group relative block overflow-hidden rounded-xl border border-line bg-card lift",
        className,
      )}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={gameImg(game.slug)}
          alt={game.title}
          fill
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 170px"
          className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.06]"
        />
        {/* hover overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-page/70 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-em text-[#04281b] shadow-glow transition-transform duration-300 group-hover:scale-105">
            <Play size={20} className="ml-0.5" fill="currentColor" />
          </span>
          <span className="px-2 text-center text-[12px] font-extrabold leading-tight text-ink">
            {game.title}
          </span>
          <span className="text-[10.5px] font-semibold text-sub">{game.provider}</span>
        </div>

        {tag && (
          <span className="absolute left-2 top-2">
            <Badge kind={tag}>{t(`common.${tag}`)}</Badge>
          </span>
        )}

        <button
          aria-label={fav ? t("game.unfavorite") : t("game.favorite")}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(game.slug);
          }}
          className={cn(
            "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-page/60 backdrop-blur-sm transition-all",
            fav
              ? "text-danger opacity-100"
              : "text-ink opacity-0 hover:text-danger group-hover:opacity-100",
          )}
        >
          <Heart size={14} fill={fav ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex items-center gap-1.5 px-2.5 py-2">
        <span className="pulse-dot-em h-1.5 w-1.5 shrink-0 rounded-full bg-em" />
        <span className="tnum truncate text-[11px] font-semibold text-mute">
          {game.playing.toLocaleString("ru-RU")} {t("common.players")}
        </span>
      </div>
    </Link>
  );
}
