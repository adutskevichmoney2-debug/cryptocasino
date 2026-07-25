/**
 * VIP-уровни: пороги по обороту (в USD-эквиваленте) и привилегии.
 * TODO(backend): прогресс игрока считается на бэкенде от реального оборота.
 */

export interface VipLevel {
  id: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  threshold: number;
  cashback: string;
  rakeback: string;
  manager: boolean;
  gifts: boolean;
  priority: boolean;
  levelUp: string;
  color: string;
}

export const VIP_LEVELS: VipLevel[] = [
  { id: "bronze", threshold: 0, cashback: "5%", rakeback: "3%", manager: false, gifts: false, priority: false, levelUp: "5 USDT", color: "#B9804A" },
  { id: "silver", threshold: 10_000, cashback: "7%", rakeback: "4%", manager: false, gifts: true, priority: false, levelUp: "25 USDT", color: "#AEB9C6" },
  { id: "gold", threshold: 50_000, cashback: "10%", rakeback: "5%", manager: false, gifts: true, priority: true, levelUp: "100 USDT", color: "#E7B93C" },
  { id: "platinum", threshold: 250_000, cashback: "12%", rakeback: "7%", manager: true, gifts: true, priority: true, levelUp: "500 USDT", color: "#8FD3E8" },
  { id: "diamond", threshold: 1_000_000, cashback: "15%", rakeback: "10%", manager: true, gifts: true, priority: true, levelUp: "2 500 USDT", color: "#7FE7C4" },
];
