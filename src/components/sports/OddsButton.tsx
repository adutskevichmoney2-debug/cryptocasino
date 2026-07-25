"use client";

import { useI18n } from "@/lib/i18n/provider";
import { useBetslip, type MarketKey } from "@/lib/stores/betslip";
import { useHasMounted } from "@/lib/hooks";
import type { MatchEvent } from "@/lib/data/sports";
import { cn } from "@/lib/utils";

const SHORT: Record<MarketKey, string> = { p1: "1", x: "X", p2: "2", over: "О", under: "П" };

export function OddsButton({
  event,
  market,
  compact,
}: {
  event: MatchEvent;
  market: MarketKey;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const mounted = useHasMounted();
  const { toggle, isSelected } = useBetslip();
  const odds =
    market === "p1" ? event.odds.p1
    : market === "x" ? event.odds.x
    : market === "p2" ? event.odds.p2
    : market === "over" ? event.odds.over
    : event.odds.under;

  if (odds === null) return null;
  const selected = mounted && isSelected(event.id, market);

  const marketLabel = (() => {
    switch (market) {
      case "p1": return `${t("sports.matchWinner")} · ${event.home}`;
      case "x": return `${t("sports.matchWinner")} · ${t("sports.draw")}`;
      case "p2": return `${t("sports.matchWinner")} · ${event.away}`;
      case "over": return `${t("sports.total")} ${t("sports.over")} ${event.odds.totalLine}`;
      case "under": return `${t("sports.total")} ${t("sports.under")} ${event.odds.totalLine}`;
    }
  })();

  const short =
    market === "over" ? `${t("sports.over")[0]} ${event.odds.totalLine}`
    : market === "under" ? `${t("sports.under")[0]} ${event.odds.totalLine}`
    : SHORT[market];

  return (
    <button
      key={selected ? "s" : "n"}
      onClick={() => toggle(event, market, odds, marketLabel)}
      className={cn(
        "odds-pop flex items-center justify-between gap-2 rounded-[9px] border font-bold transition-all",
        compact ? "px-2.5 py-1.5 text-[12px]" : "flex-1 px-3 py-2 text-[13px]",
        selected
          ? "border-em bg-em text-[#04281b] shadow-[0_4px_14px_-4px_rgba(23,197,136,0.5)]"
          : "border-line bg-field text-sub hover:border-line2 hover:bg-raise hover:text-ink",
      )}
    >
      <span className={cn("font-semibold", selected ? "text-[#04281b]/70" : "text-mute")}>
        {short}
      </span>
      <span className="tnum">{odds.toFixed(2)}</span>
    </button>
  );
}
