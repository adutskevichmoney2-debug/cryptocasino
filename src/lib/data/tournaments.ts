/**
 * Турниры — мок-данные (лидерборд демонстрационный, ники замаскированы).
 * TODO(backend): реальные турниры и лидерборды приходят из API.
 */

export interface TournamentRow {
  rank: number;
  player: string;
  points: number;
  prize: string;
}

export interface Tournament {
  id: string;
  title: string;
  prizePool: string;
  /** часов до конца от текущего момента */
  endsOffsetH: number;
  participants: number;
  scope: "slots" | "live" | "originals" | "all";
  leaderboard: TournamentRow[];
}

const lb = (rows: [string, number, string][]): TournamentRow[] =>
  rows.map(([player, points, prize], i) => ({ rank: i + 1, player, points, prize }));

export const TOURNAMENTS: Tournament[] = [
  {
    id: "weekend-slots-race",
    title: "Weekend Slots Race",
    prizePool: "50 000 USDT",
    endsOffsetH: 38,
    participants: 1873,
    scope: "slots",
    leaderboard: lb([
      ["D***mond", 128450, "15 000 USDT"],
      ["Kri***85", 117230, "10 000 USDT"],
      ["mo***rex", 98410, "7 500 USDT"],
      ["Sa***a_w", 87155, "5 000 USDT"],
      ["lu***y77", 76980, "3 500 USDT"],
      ["Ni***las", 65340, "2 500 USDT"],
      ["cr***to_k", 54120, "2 000 USDT"],
      ["Ve***na", 43980, "1 500 USDT"],
      ["ba***boo", 39875, "1 000 USDT"],
      ["Ze***ro", 35210, "500 USDT"],
    ]),
  },
  {
    id: "live-casino-cup",
    title: "Live Casino Cup",
    prizePool: "25 000 USDT",
    endsOffsetH: 86,
    participants: 764,
    scope: "live",
    leaderboard: lb([
      ["Ro***al", 74210, "8 000 USDT"],
      ["bl***ck21", 68930, "5 500 USDT"],
      ["Ma***ik", 55480, "4 000 USDT"],
      ["qu***en", 47825, "3 000 USDT"],
      ["Am***ra", 39640, "2 000 USDT"],
      ["po***er_x", 31255, "1 500 USDT"],
      ["Le***on", 24980, "1 000 USDT"],
    ]),
  },
  {
    id: "originals-sprint",
    title: "Originals Sprint",
    prizePool: "10 000 USDT",
    endsOffsetH: 14,
    participants: 2311,
    scope: "originals",
    leaderboard: lb([
      ["cr***sh_god", 214870, "3 000 USDT"],
      ["mi***es_pro", 187420, "2 000 USDT"],
      ["Pl***ko", 156310, "1 500 USDT"],
      ["hi***lo", 132850, "1 200 USDT"],
      ["Di***eKing", 118440, "1 000 USDT"],
      ["li***bo", 97210, "800 USDT"],
      ["fa***st", 78455, "500 USDT"],
    ]),
  },
];
