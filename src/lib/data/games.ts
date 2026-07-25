/**
 * Каталог игр — мок-данные.
 * Названия игр вымышленные (права на реальные тайтлы принадлежат провайдерам).
 * TODO(backend): заменить на каталог из API агрегатора/провайдера.
 * Обложки: /public/games/{slug}.webp
 */

export type GameCategory = "slots" | "live" | "game-shows" | "table" | "originals";
export type GameTag = "new" | "hot" | "top";
export type Volatility = "low" | "medium" | "high";

export interface Game {
  slug: string;
  title: string;
  provider: string;
  category: GameCategory;
  tags?: GameTag[];
  rtp: number;
  volatility: Volatility;
  maxWin: string;
  /** мок-счётчик "сейчас играют" для витрины */
  playing: number;
}

export const GAMES: Game[] = [
  // ---------------- Slots ----------------
  { slug: "olympian-storm", title: "Olympian Storm", provider: "Pragmatic Play", category: "slots", tags: ["hot", "top"], rtp: 96.5, volatility: "high", maxWin: "x10 000", playing: 1284 },
  { slug: "candy-avalanche", title: "Candy Avalanche", provider: "Pragmatic Play", category: "slots", tags: ["hot"], rtp: 96.48, volatility: "high", maxWin: "x5 000", playing: 976 },
  { slug: "scrolls-of-anubis", title: "Scrolls of Anubis", provider: "Play'n GO", category: "slots", tags: ["top"], rtp: 96.21, volatility: "high", maxWin: "x7 500", playing: 741 },
  { slug: "samurai-spirit", title: "Samurai Spirit", provider: "Nolimit City", category: "slots", tags: ["new"], rtp: 96.09, volatility: "high", maxWin: "x15 000", playing: 358 },
  { slug: "miners-luck", title: "Miner's Luck", provider: "Hacksaw Gaming", category: "slots", tags: ["hot"], rtp: 96.3, volatility: "high", maxWin: "x10 000", playing: 689 },
  { slug: "outlaws-gold", title: "Outlaw's Gold", provider: "Hacksaw Gaming", category: "slots", tags: ["new"], rtp: 96.22, volatility: "high", maxWin: "x12 500", playing: 412 },
  { slug: "dragons-hoard", title: "Dragon's Hoard", provider: "Push Gaming", category: "slots", rtp: 96.4, volatility: "medium", maxWin: "x6 000", playing: 523 },
  { slug: "crystal-cascade", title: "Crystal Cascade", provider: "Push Gaming", category: "slots", tags: ["new"], rtp: 96.55, volatility: "medium", maxWin: "x5 500", playing: 264 },
  { slug: "norse-legends", title: "Norse Legends", provider: "NetEnt", category: "slots", tags: ["top"], rtp: 96.12, volatility: "medium", maxWin: "x8 000", playing: 445 },
  { slug: "thunder-strike", title: "Thunder Strike", provider: "NetEnt", category: "slots", rtp: 96.05, volatility: "high", maxWin: "x9 000", playing: 331 },
  { slug: "cosmic-spins", title: "Cosmic Spins", provider: "NetEnt", category: "slots", rtp: 96.35, volatility: "medium", maxWin: "x2 500", playing: 208 },
  { slug: "aztec-idols", title: "Aztec Idols", provider: "Red Tiger", category: "slots", rtp: 95.95, volatility: "medium", maxWin: "x4 500", playing: 287 },
  { slug: "desert-mirage", title: "Desert Mirage", provider: "Red Tiger", category: "slots", rtp: 96.18, volatility: "medium", maxWin: "x3 500", playing: 159 },
  { slug: "neon-fruits", title: "Neon Fruits", provider: "BGaming", category: "slots", tags: ["top"], rtp: 97.1, volatility: "low", maxWin: "x1 000", playing: 602 },
  { slug: "cherry-fiesta", title: "Cherry Fiesta", provider: "BGaming", category: "slots", rtp: 96.9, volatility: "low", maxWin: "x500", playing: 178 },
  { slug: "lucky-sevens", title: "Lucky Sevens Deluxe", provider: "BGaming", category: "slots", rtp: 96.8, volatility: "low", maxWin: "x800", playing: 244 },
  { slug: "pirates-plunder", title: "Pirate's Plunder", provider: "Play'n GO", category: "slots", rtp: 96.25, volatility: "medium", maxWin: "x5 000", playing: 319 },
  { slug: "mystic-forest", title: "Mystic Forest", provider: "Play'n GO", category: "slots", rtp: 96.2, volatility: "medium", maxWin: "x4 000", playing: 196 },
  { slug: "vampire-nights", title: "Vampire Nights", provider: "Nolimit City", category: "slots", tags: ["hot"], rtp: 96.06, volatility: "high", maxWin: "x20 000", playing: 534 },
  { slug: "jungle-cascade", title: "Jungle Cascade", provider: "Pragmatic Play", category: "slots", rtp: 96.5, volatility: "high", maxWin: "x5 000", playing: 402 },
  { slug: "arctic-wilds", title: "Arctic Wilds", provider: "Playson", category: "slots", rtp: 96.0, volatility: "medium", maxWin: "x3 000", playing: 143 },
  { slug: "fortune-koi", title: "Fortune Koi", provider: "Playson", category: "slots", rtp: 96.4, volatility: "low", maxWin: "x2 000", playing: 231 },
  { slug: "royal-gems", title: "Royal Gems", provider: "Playson", category: "slots", rtp: 96.15, volatility: "low", maxWin: "x1 500", playing: 122 },
  { slug: "wild-safari", title: "Wild Safari", provider: "Pragmatic Play", category: "slots", rtp: 96.3, volatility: "medium", maxWin: "x4 000", playing: 268 },

  // ---------------- Live casino ----------------
  { slug: "roulette-royale", title: "Roulette Royale", provider: "Evolution", category: "live", tags: ["top"], rtp: 97.3, volatility: "medium", maxWin: "x35", playing: 1842 },
  { slug: "blackjack-vip", title: "Blackjack VIP", provider: "Evolution", category: "live", tags: ["hot"], rtp: 99.28, volatility: "low", maxWin: "x3", playing: 926 },
  { slug: "speed-baccarat", title: "Speed Baccarat", provider: "Ezugi", category: "live", rtp: 98.94, volatility: "low", maxWin: "x9", playing: 517 },
  { slug: "casino-holdem", title: "Casino Hold'em", provider: "Evolution", category: "live", rtp: 97.84, volatility: "medium", maxWin: "x100", playing: 348 },
  { slug: "auto-roulette", title: "Auto Roulette", provider: "Ezugi", category: "live", rtp: 97.3, volatility: "medium", maxWin: "x35", playing: 733 },
  { slug: "dragon-tiger", title: "Dragon Tiger", provider: "Ezugi", category: "live", rtp: 96.72, volatility: "low", maxWin: "x11", playing: 402 },
  { slug: "three-card-poker", title: "Three Card Poker", provider: "Evolution", category: "live", rtp: 96.63, volatility: "medium", maxWin: "x100", playing: 218 },
  { slug: "andar-bahar", title: "Andar Bahar", provider: "Ezugi", category: "live", rtp: 97.0, volatility: "low", maxWin: "x2", playing: 356 },

  // ---------------- Game shows ----------------
  { slug: "wheel-of-legends", title: "Wheel of Legends", provider: "Evolution", category: "game-shows", tags: ["hot", "top"], rtp: 96.51, volatility: "medium", maxWin: "x20 000", playing: 2201 },
  { slug: "crypto-drop", title: "Crypto Drop Live", provider: "Evolution", category: "game-shows", tags: ["new"], rtp: 96.3, volatility: "high", maxWin: "x10 000", playing: 884 },
  { slug: "dice-duel", title: "Dice Duel Live", provider: "Ezugi", category: "game-shows", rtp: 96.6, volatility: "medium", maxWin: "x500", playing: 311 },
  { slug: "mega-multiplier", title: "Mega Multiplier Show", provider: "Evolution", category: "game-shows", rtp: 96.4, volatility: "high", maxWin: "x25 000", playing: 1017 },

  // ---------------- Table games ----------------
  { slug: "european-roulette", title: "European Roulette", provider: "BGaming", category: "table", rtp: 97.3, volatility: "medium", maxWin: "x35", playing: 264 },
  { slug: "classic-blackjack", title: "Classic Blackjack", provider: "BGaming", category: "table", rtp: 99.6, volatility: "low", maxWin: "x3", playing: 189 },
  { slug: "baccarat-pro", title: "Baccarat Pro", provider: "BGaming", category: "table", rtp: 98.9, volatility: "low", maxWin: "x9", playing: 117 },
  { slug: "video-poker", title: "Jacks or Better", provider: "BGaming", category: "table", rtp: 99.5, volatility: "low", maxWin: "x800", playing: 95 },

  // ---------------- Originals ----------------
  { slug: "crash", title: "Crash", provider: "CryptoCasino Originals", category: "originals", tags: ["hot", "top"], rtp: 99.0, volatility: "high", maxWin: "x1 000 000", playing: 3125 },
  { slug: "plinko", title: "Plinko", provider: "CryptoCasino Originals", category: "originals", tags: ["hot"], rtp: 99.0, volatility: "medium", maxWin: "x1 000", playing: 1744 },
  { slug: "mines", title: "Mines", provider: "CryptoCasino Originals", category: "originals", tags: ["top"], rtp: 99.0, volatility: "high", maxWin: "x24 750", playing: 1518 },
  { slug: "dice", title: "Dice", provider: "CryptoCasino Originals", category: "originals", rtp: 99.0, volatility: "medium", maxWin: "x9 900", playing: 1102 },
  { slug: "limbo", title: "Limbo", provider: "CryptoCasino Originals", category: "originals", rtp: 99.0, volatility: "high", maxWin: "x1 000 000", playing: 923 },
  { slug: "wheel", title: "Wheel", provider: "CryptoCasino Originals", category: "originals", rtp: 99.0, volatility: "medium", maxWin: "x49.5", playing: 684 },
  { slug: "keno", title: "Keno", provider: "CryptoCasino Originals", category: "originals", rtp: 99.0, volatility: "high", maxWin: "x1 000", playing: 415 },
  { slug: "hilo", title: "HiLo", provider: "CryptoCasino Originals", category: "originals", rtp: 99.0, volatility: "medium", maxWin: "x4 900", playing: 507 },
];

export const gameBySlug = (slug: string): Game | undefined =>
  GAMES.find((g) => g.slug === slug);

export const gameImg = (slug: string) => `/games/${slug}.webp`;

export const CATEGORIES: { id: GameCategory | "all"; nameKey: string }[] = [
  { id: "all", nameKey: "common.all" },
  { id: "slots", nameKey: "nav.slots" },
  { id: "live", nameKey: "nav.liveCasino" },
  { id: "game-shows", nameKey: "nav.gameShows" },
  { id: "table", nameKey: "nav.tableGames" },
  { id: "originals", nameKey: "nav.originals" },
];

export const PROVIDERS: string[] = Array.from(new Set(GAMES.map((g) => g.provider)));
