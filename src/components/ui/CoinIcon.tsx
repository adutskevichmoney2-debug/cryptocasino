import { coinBySymbol } from "@/lib/data/coins";
import { cn } from "@/lib/utils";

const GLYPHS: Record<string, string> = {
  BTC: "₿",
  ETH: "Ξ",
  USDT: "₮",
  USDC: "C",
  BNB: "B",
  SOL: "◎",
  TRX: "T",
  TON: "◆",
  LTC: "Ł",
  DOGE: "Ð",
  XRP: "✕",
  ADA: "₳",
};

export function CoinIcon({
  symbol,
  size = 22,
  className,
}: {
  symbol: string;
  size?: number;
  className?: string;
}) {
  const coin = coinBySymbol(symbol);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-extrabold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.52,
        background: coin?.color ?? "#5F6E82",
        textShadow: "0 1px 2px rgba(0,0,0,0.25)",
      }}
      aria-hidden
    >
      {GLYPHS[symbol] ?? symbol[0]}
    </span>
  );
}
