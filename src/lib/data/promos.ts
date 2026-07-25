/**
 * Бонусы/акции. Тексты берутся из i18n (bonuses.cards.{id}),
 * здесь — параметры и оформление карточек.
 * TODO(backend): статусы активации бонусов должны храниться на бэкенде.
 */

export interface Promo {
  id: "welcome" | "cashback" | "rakeback" | "reload";
  badge: string;
  wager: string;
  minDep: string;
  img: string;
  accent: string;
}

export const PROMOS: Promo[] = [
  { id: "welcome", badge: "200%", wager: "x40", minDep: "20 USDT", img: "/images/bonus-welcome.webp", accent: "#17C588" },
  { id: "cashback", badge: "15%", wager: "x3", minDep: "—", img: "/images/bonus-cashback.webp", accent: "#4C9AFF" },
  { id: "rakeback", badge: "10%", wager: "—", minDep: "—", img: "/images/bonus-rakeback.webp", accent: "#B183F0" },
  { id: "reload", badge: "+50%", wager: "x30", minDep: "10 USDT", img: "/images/bonus-reload.webp", accent: "#F0A322" },
];
