"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Expand, Heart, Info, Play } from "lucide-react";
import { GameRow } from "@/components/casino/GameRow";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/stores/auth";
import { useUi } from "@/lib/stores/ui";
import { usePrefs } from "@/lib/stores/prefs";
import { useHasMounted } from "@/lib/hooks";
import { GAMES, gameBySlug, gameImg } from "@/lib/data/games";
import { cn } from "@/lib/utils";

type Mode = "idle" | "demo" | "real";

export function GameView({ slug }: { slug: string }) {
  const { t } = useI18n();
  const game = gameBySlug(slug)!;
  const mounted = useHasMounted();
  const user = useAuth((s) => s.user);
  const { openAuth, toast } = useUi();
  const { favorites, toggleFavorite, pushRecent } = usePrefs();
  const [mode, setMode] = useState<Mode>("idle");
  const frameRef = useRef<HTMLDivElement>(null);
  const fav = mounted && favorites.includes(game.slug);

  // Синхронизация с внешним стором (zustand) — фиксируем визит игры.
  // Сброс режима при смене игры делает key={slug} на уровне страницы.
  useEffect(() => {
    pushRecent(game.slug);
  }, [game.slug, pushRecent]);

  const startReal = () => {
    if (!user) {
      toast("info", t("game.loginToPlay"));
      openAuth("login");
      return;
    }
    setMode("real");
  };

  const fullscreen = () => {
    frameRef.current?.requestFullscreen?.().catch(() => {});
  };

  const similar = GAMES.filter((g) => g.category === game.category && g.slug !== game.slug).slice(0, 8);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
      {/* game frame */}
      <div ref={frameRef} className="overflow-hidden rounded-2xl border border-line bg-panel">
        <div className="relative aspect-[16/10] sm:aspect-[16/9]">
          {mode === "idle" ? (
            <>
              <Image
                src={gameImg(game.slug)}
                alt={game.title}
                fill
                sizes="100vw"
                priority
                className="scale-110 object-cover blur-xl brightness-[0.35]"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                <Image
                  src={gameImg(game.slug)}
                  alt={game.title}
                  width={140}
                  height={187}
                  priority
                  className="w-[110px] rounded-xl border border-line2 shadow-pop sm:w-[140px]"
                />
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">{game.title}</h1>
                  <p className="mt-1 text-[13px] font-semibold text-sub">{game.provider}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2.5">
                  <Button size="lg" onClick={startReal}>
                    <Play size={17} fill="currentColor" />
                    {t("game.real")}
                  </Button>
                  <Button size="lg" variant="secondary" onClick={() => setMode("demo")}>
                    {t("game.demo")}
                  </Button>
                </div>
                {mounted && !user && (
                  <p className="text-[12px] text-mute">{t("game.loginToPlay")}</p>
                )}
              </div>
            </>
          ) : (
            /*
              ============================================================
              GAME_PROVIDER_EMBED — точка интеграции игрового провайдера.
              TODO(backend): после покупки прав заменить блок ниже на iframe
              лаунчера провайдера, например:

                <iframe
                  src={launcherUrl({ gameId: game.slug, mode, userToken })}
                  className="absolute inset-0 h-full w-full"
                  allow="fullscreen; autoplay"
                />

              где launcherUrl выдаёт бэкенд (агрегатор / прямой контракт).
              Режим mode === "demo" | "real" уже прокинут в состоянии.
              ============================================================
            */
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-page p-6 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-line2 text-mute">
                <Play size={26} />
              </span>
              <p className="text-[15px] font-extrabold">
                {t("game.providerZone")} · {mode === "real" ? t("game.real") : t("game.demo")}
              </p>
              <p className="max-w-[440px] text-[12.5px] leading-relaxed text-mute">
                {t("game.providerZoneHint")}
              </p>
            </div>
          )}
        </div>

        {/* control bar */}
        <div className="flex items-center gap-2 border-t border-line px-4 py-3">
          <p className="min-w-0 flex-1 truncate text-[13.5px] font-bold">
            {game.title}
            <span className="ml-2 text-[12px] font-semibold text-mute">{game.provider}</span>
          </p>
          {game.tags?.map((tag) => (
            <Badge key={tag} kind={tag}>
              {t(`common.${tag}`)}
            </Badge>
          ))}
          <button
            onClick={() => toggleFavorite(game.slug)}
            title={fav ? t("game.unfavorite") : t("game.favorite")}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-[10px] transition-colors",
              fav ? "bg-danger/10 text-danger" : "text-mute hover:bg-raise hover:text-ink",
            )}
          >
            <Heart size={16} fill={fav ? "currentColor" : "none"} />
          </button>
          <button
            onClick={fullscreen}
            title={t("game.fullscreen")}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-mute transition-colors hover:bg-raise hover:text-ink"
          >
            <Expand size={16} />
          </button>
        </div>
      </div>

      {/* info */}
      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        {[
          { label: t("game.rtp"), value: `${game.rtp}%` },
          { label: t("game.volatility"), value: t(`game.vol.${game.volatility}`) },
          { label: t("game.maxWin"), value: game.maxWin },
          { label: t("game.provider"), value: game.provider },
        ].map((i) => (
          <div key={i.label} className="surface px-4 py-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-mute">{i.label}</p>
            <p className="tnum mt-1 truncate text-[15px] font-extrabold">{i.value}</p>
          </div>
        ))}
      </div>

      <div className="surface mt-3 flex items-start gap-3 px-4 py-3.5">
        <Info size={16} className="mt-0.5 shrink-0 text-mute" />
        <p className="text-[12.5px] leading-relaxed text-mute">{t("game.providerZoneHint")}</p>
      </div>

      {/* similar */}
      <div className="mt-9">
        <GameRow title={t("game.similar")} games={similar} href={`/casino?cat=${game.category}`} />
      </div>
    </div>
  );
}
