/**
 * Лента «живых выигрышей» — ДЕМО-ДАННЫЕ для витрины (помечены в UI бейджем).
 * TODO(backend): заменить на реальный фид ставок (websocket/Supabase Realtime).
 */

export interface WinEntry {
  player: string;
  gameSlug: string;
  multiplier: string;
  amount: string;
  coin: string;
}

export const DEMO_WINS: WinEntry[] = [
  { player: "cr***sh_god", gameSlug: "crash", multiplier: "x38.2", amount: "1 910", coin: "USDT" },
  { player: "Ve***na", gameSlug: "olympian-storm", multiplier: "x412", amount: "2 060", coin: "USDT" },
  { player: "mo***rex", gameSlug: "mines", multiplier: "x17.4", amount: "348", coin: "USDT" },
  { player: "lu***y77", gameSlug: "wheel-of-legends", multiplier: "x50", amount: "0.0104", coin: "BTC" },
  { player: "Ni***las", gameSlug: "vampire-nights", multiplier: "x1 250", amount: "6 250", coin: "USDT" },
  { player: "Sa***a_w", gameSlug: "plinko", multiplier: "x130", amount: "0.31", coin: "ETH" },
  { player: "ba***boo", gameSlug: "candy-avalanche", multiplier: "x89", amount: "445", coin: "USDT" },
  { player: "Ze***ro", gameSlug: "limbo", multiplier: "x74.1", amount: "1 482", coin: "USDT" },
  { player: "qu***en", gameSlug: "roulette-royale", multiplier: "x35", amount: "700", coin: "USDT" },
  { player: "Di***eKing", gameSlug: "miners-luck", multiplier: "x218", amount: "873", coin: "USDT" },
  { player: "po***er_x", gameSlug: "blackjack-vip", multiplier: "x2.5", amount: "1 250", coin: "USDT" },
  { player: "Am***ra", gameSlug: "scrolls-of-anubis", multiplier: "x340", amount: "1 700", coin: "USDT" },
];
