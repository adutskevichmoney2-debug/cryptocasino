"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDownWideNarrow, Check, ChevronDown, Heart, Layers, Search } from "lucide-react";
import { GameCard } from "@/components/casino/GameCard";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { EmptyState } from "@/components/ui/misc";
import { useI18n } from "@/lib/i18n/provider";
import { usePrefs } from "@/lib/stores/prefs";
import { useHasMounted } from "@/lib/hooks";
import { CATEGORIES, GAMES, PROVIDERS, type GameCategory } from "@/lib/data/games";
import { cn } from "@/lib/utils";

type Cat = GameCategory | "all" | "favorites";
type Sort = "popular" | "az" | "rtp";
const PAGE = 18;

function CasinoContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mounted = useHasMounted();
  const favorites = usePrefs((s) => s.favorites);

  // Категория живёт в URL (?cat=…) — единый источник истины, работает
  // из сайдбара, футера и при прямом переходе по ссылке.
  const cat = (searchParams.get("cat") as Cat | null) ?? "all";
  const [q, setQ] = useState("");
  const [provider, setProvider] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("popular");

  // "Показать ещё" сбрасывается при смене фильтров без эффектов:
  // счётчик привязан к ключу текущей комбинации фильтров.
  const filterKey = `${cat}|${q}|${provider}|${sort}`;
  const [page, setPage] = useState({ key: filterKey, n: PAGE });
  const visible = page.key === filterKey ? page.n : PAGE;

  const selectCat = (c: Cat) => {
    router.replace(c === "all" ? "/casino" : `/casino?cat=${c}`, { scroll: false });
  };

  const list = useMemo(() => {
    let games = [...GAMES];
    if (cat === "favorites") games = games.filter((g) => favorites.includes(g.slug));
    else if (cat !== "all") games = games.filter((g) => g.category === cat);
    if (provider !== "all") games = games.filter((g) => g.provider === provider);
    const query = q.trim().toLowerCase();
    if (query) {
      games = games.filter(
        (g) => g.title.toLowerCase().includes(query) || g.provider.toLowerCase().includes(query),
      );
    }
    switch (sort) {
      case "popular": games.sort((a, b) => b.playing - a.playing); break;
      case "az": games.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "rtp": games.sort((a, b) => b.rtp - a.rtp); break;
    }
    return games;
  }, [cat, q, provider, sort, favorites]);

  const pills: { id: Cat; label: string }[] = [
    ...CATEGORIES.map((c) => ({ id: c.id as Cat, label: t(c.nameKey) })),
    { id: "favorites", label: t("common.favorites") },
  ];

  const sortLabels: Record<Sort, string> = {
    popular: t("nav.popular"),
    az: "A–Z",
    rtp: "RTP",
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
      <h1 className="mb-5 text-2xl font-extrabold tracking-tight sm:text-3xl">{t("nav.casino")}</h1>

      {/* controls */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("common.searchGames")}
            className="h-11 w-full rounded-[10px] border border-line bg-field pl-10 pr-4 text-sm text-ink outline-none placeholder:text-mute focus:border-em/70"
          />
        </div>
        <div className="flex gap-2">
          <Dropdown
            width="w-60"
            trigger={(open) => (
              <button
                className={cn(
                  "flex h-11 items-center gap-2 rounded-[10px] border border-line bg-field px-3.5 text-[13px] font-bold text-sub transition-colors hover:text-ink",
                  open && "border-line2 text-ink",
                )}
              >
                <Layers size={15} />
                {provider === "all" ? t("common.allProviders") : provider}
                <ChevronDown size={14} className={cn("text-mute transition-transform", open && "rotate-180")} />
              </button>
            )}
          >
            {(close) => (
              <div className="max-h-72 overflow-y-auto p-1.5">
                {["all", ...PROVIDERS].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setProvider(p);
                      close();
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13px] font-semibold transition-colors hover:bg-hover",
                      provider === p ? "text-em" : "text-sub hover:text-ink",
                    )}
                  >
                    {p === "all" ? t("common.allProviders") : p}
                    {provider === p && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </Dropdown>

          <Dropdown
            width="w-44"
            trigger={(open) => (
              <button
                className={cn(
                  "flex h-11 items-center gap-2 rounded-[10px] border border-line bg-field px-3.5 text-[13px] font-bold text-sub transition-colors hover:text-ink",
                  open && "border-line2 text-ink",
                )}
              >
                <ArrowDownWideNarrow size={15} />
                {sortLabels[sort]}
                <ChevronDown size={14} className={cn("text-mute transition-transform", open && "rotate-180")} />
              </button>
            )}
          >
            {(close) => (
              <div className="p-1.5">
                {(Object.keys(sortLabels) as Sort[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSort(s);
                      close();
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13px] font-semibold transition-colors hover:bg-hover",
                      sort === s ? "text-em" : "text-sub hover:text-ink",
                    )}
                  >
                    {sortLabels[s]}
                    {sort === s && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </Dropdown>
        </div>
      </div>

      {/* category pills */}
      <div className="no-scrollbar -mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1">
        {pills.map((p) => (
          <button
            key={p.id}
            onClick={() => selectCat(p.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold transition-colors",
              cat === p.id
                ? "bg-em text-[#04281b]"
                : "border border-line bg-card text-sub hover:border-line2 hover:text-ink",
            )}
          >
            {p.id === "favorites" && <Heart size={13} />}
            {p.label}
          </button>
        ))}
      </div>

      {/* grid */}
      {list.length === 0 ? (
        <EmptyState
          icon={cat === "favorites" ? <Heart size={26} /> : undefined}
          title={t("common.nothingFound")}
          hint={t("common.nothingFoundHint")}
        />
      ) : (
        <>
          <p className="mb-3 text-[12.5px] font-semibold text-mute">
            {list.length} {t("common.results")}
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {(mounted ? list : list.slice(0, PAGE)).slice(0, visible).map((g) => (
              <GameCard key={g.slug} game={g} />
            ))}
          </div>
          {visible < list.length && (
            <div className="mt-7 text-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setPage({ key: filterKey, n: visible + PAGE })}
              >
                {t("common.loadMore")} · {list.length - visible}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CasinoPage() {
  return (
    <Suspense fallback={null}>
      <CasinoContent />
    </Suspense>
  );
}
