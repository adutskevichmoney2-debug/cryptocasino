/**
 * Спортивные события — мок-данные.
 * TODO(backend): заменить на фид спортивного провайдера (odds feed / iframe-виджет).
 * Точка интеграции в UI помечена как SPORTS_PROVIDER_EMBED.
 * Время матчей задаётся смещением от "сейчас", чтобы витрина всегда выглядела живой.
 */

export type SportId =
  | "football"
  | "basketball"
  | "tennis"
  | "hockey"
  | "esports"
  | "mma"
  | "tableTennis"
  | "volleyball";

export interface MatchOdds {
  p1: number;
  x: number | null;
  p2: number;
  totalLine: number;
  over: number;
  under: number;
}

export interface MatchEvent {
  id: string;
  sport: SportId;
  league: string;
  home: string;
  away: string;
  /** минуты от текущего момента; отрицательное значение = матч идёт (live) */
  startOffsetMin: number;
  score?: [number, number];
  liveClock?: string;
  odds: MatchOdds;
  marketsCount: number;
}

export const SPORTS: { id: SportId; icon: string }[] = [
  { id: "football", icon: "⚽" },
  { id: "basketball", icon: "🏀" },
  { id: "tennis", icon: "🎾" },
  { id: "esports", icon: "🎮" },
  { id: "hockey", icon: "🏒" },
  { id: "mma", icon: "🥊" },
  { id: "tableTennis", icon: "🏓" },
  { id: "volleyball", icon: "🏐" },
];

export const EVENTS: MatchEvent[] = [
  // ---- LIVE ----
  { id: "fb-rm-fcb", sport: "football", league: "Ла Лига", home: "Реал Мадрид", away: "Барселона", startOffsetMin: -52, score: [1, 1], liveClock: "52'", odds: { p1: 2.35, x: 3.2, p2: 3.1, totalLine: 2.5, over: 1.72, under: 2.1 }, marketsCount: 148 },
  { id: "fb-mci-liv", sport: "football", league: "Премьер-лига", home: "Манчестер Сити", away: "Ливерпуль", startOffsetMin: -23, score: [0, 1], liveClock: "23'", odds: { p1: 1.95, x: 3.6, p2: 3.9, totalLine: 3.5, over: 2.05, under: 1.78 }, marketsCount: 156 },
  { id: "bb-lal-bos", sport: "basketball", league: "NBA", home: "Лейкерс", away: "Селтикс", startOffsetMin: -34, score: [58, 61], liveClock: "3Q 07:12", odds: { p1: 2.1, x: null, p2: 1.75, totalLine: 224.5, over: 1.9, under: 1.9 }, marketsCount: 92 },
  { id: "es-navi-vit", sport: "esports", league: "CS2 • BLAST Major", home: "NAVI", away: "Vitality", startOffsetMin: -41, score: [1, 0], liveClock: "Map 2", odds: { p1: 1.68, x: null, p2: 2.18, totalLine: 2.5, over: 1.85, under: 1.85 }, marketsCount: 38 },
  { id: "tn-alc-sin", sport: "tennis", league: "ATP • Уимблдон", home: "Алькарас", away: "Синнер", startOffsetMin: -76, score: [1, 1], liveClock: "3-й сет", odds: { p1: 1.88, x: null, p2: 1.92, totalLine: 38.5, over: 1.87, under: 1.87 }, marketsCount: 54 },

  // ---- UPCOMING ----
  { id: "fb-ars-bay", sport: "football", league: "Лига чемпионов", home: "Арсенал", away: "Бавария", startOffsetMin: 95, odds: { p1: 2.55, x: 3.45, p2: 2.75, totalLine: 2.5, over: 1.8, under: 2.0 }, marketsCount: 132 },
  { id: "fb-psg-om", sport: "football", league: "Лига 1", home: "ПСЖ", away: "Марсель", startOffsetMin: 170, odds: { p1: 1.55, x: 4.2, p2: 5.8, totalLine: 3.0, over: 1.95, under: 1.85 }, marketsCount: 118 },
  { id: "fb-int-mil", sport: "football", league: "Серия А", home: "Интер", away: "Милан", startOffsetMin: 250, odds: { p1: 2.05, x: 3.3, p2: 3.75, totalLine: 2.5, over: 1.88, under: 1.92 }, marketsCount: 124 },
  { id: "fb-bay-bvb", sport: "football", league: "Бундеслига", home: "Бавария", away: "Боруссия Д", startOffsetMin: 1420, odds: { p1: 1.62, x: 4.3, p2: 4.9, totalLine: 3.5, over: 1.98, under: 1.82 }, marketsCount: 140 },
  { id: "bb-gsw-mil", sport: "basketball", league: "NBA", home: "Уорриорз", away: "Бакс", startOffsetMin: 320, odds: { p1: 1.85, x: null, p2: 1.95, totalLine: 231.5, over: 1.9, under: 1.9 }, marketsCount: 84 },
  { id: "tn-djo-med", sport: "tennis", league: "ATP • Мастерс", home: "Джокович", away: "Медведев", startOffsetMin: 210, odds: { p1: 1.72, x: null, p2: 2.12, totalLine: 22.5, over: 1.83, under: 1.91 }, marketsCount: 47 },
  { id: "hk-nyr-bos", sport: "hockey", league: "NHL", home: "Рейнджерс", away: "Брюинз", startOffsetMin: 400, odds: { p1: 2.25, x: 3.9, p2: 2.6, totalLine: 5.5, over: 1.92, under: 1.88 }, marketsCount: 66 },
  { id: "hk-col-edm", sport: "hockey", league: "NHL", home: "Эвеланш", away: "Ойлерз", startOffsetMin: 460, odds: { p1: 2.05, x: 4.0, p2: 2.85, totalLine: 6.5, over: 2.0, under: 1.8 }, marketsCount: 71 },
  { id: "es-spirit-liq", sport: "esports", league: "Dota 2 • The International", home: "Team Spirit", away: "Team Liquid", startOffsetMin: 150, odds: { p1: 1.55, x: null, p2: 2.45, totalLine: 2.5, over: 1.9, under: 1.8 }, marketsCount: 32 },
  { id: "es-g2-faze", sport: "esports", league: "CS2 • ESL Pro League", home: "G2", away: "FaZe", startOffsetMin: 280, odds: { p1: 1.92, x: null, p2: 1.88, totalLine: 2.5, over: 1.87, under: 1.83 }, marketsCount: 35 },
  { id: "mma-ufc-main", sport: "mma", league: "UFC Fight Night", home: "Пантожа", away: "Кара-Франс", startOffsetMin: 2900, odds: { p1: 1.65, x: null, p2: 2.3, totalLine: 2.5, over: 1.75, under: 2.05 }, marketsCount: 24 },
  { id: "vb-pol-bra", sport: "volleyball", league: "Лига наций", home: "Польша", away: "Бразилия", startOffsetMin: 520, odds: { p1: 1.78, x: null, p2: 2.05, totalLine: 4.5, over: 2.1, under: 1.72 }, marketsCount: 18 },
  { id: "tt-cn-jp", sport: "tableTennis", league: "WTT Champions", home: "Ван Чуцинь", away: "Харимото", startOffsetMin: 90, odds: { p1: 1.6, x: null, p2: 2.35, totalLine: 74.5, over: 1.9, under: 1.9 }, marketsCount: 12 },
];

export const liveEvents = () => EVENTS.filter((e) => e.startOffsetMin < 0);
export const upcomingEvents = () => EVENTS.filter((e) => e.startOffsetMin >= 0);
export const eventById = (id: string) => EVENTS.find((e) => e.id === id);
