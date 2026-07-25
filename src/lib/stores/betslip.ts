"use client";

import { create } from "zustand";
import type { MatchEvent } from "@/lib/data/sports";

/**
 * Купон ставок (мок).
 * TODO(backend): размещение ставки → API букмекерского модуля; sanity-проверки
 * коэффициентов и лимитов выполняются на сервере.
 */

export type MarketKey = "p1" | "x" | "p2" | "over" | "under";

export interface Selection {
  eventId: string;
  market: MarketKey;
  odds: number;
  eventLabel: string;
  marketLabel: string;
}

interface BetslipState {
  selections: Selection[];
  stake: string;
  open: boolean; // мобильная шторка
  setStake: (v: string) => void;
  setOpen: (v: boolean) => void;
  toggle: (event: MatchEvent, market: MarketKey, odds: number, marketLabel: string) => void;
  remove: (eventId: string, market: MarketKey) => void;
  clear: () => void;
  isSelected: (eventId: string, market: MarketKey) => boolean;
  totalOdds: () => number;
}

export const useBetslip = create<BetslipState>()((set, get) => ({
  selections: [],
  stake: "",
  open: false,

  setStake: (v) => set({ stake: v }),
  setOpen: (v) => set({ open: v }),

  toggle: (event, market, odds, marketLabel) =>
    set((s) => {
      const exists = s.selections.find(
        (x) => x.eventId === event.id && x.market === market,
      );
      if (exists) {
        return {
          selections: s.selections.filter(
            (x) => !(x.eventId === event.id && x.market === market),
          ),
        };
      }
      // одно событие — один выбор (замена рынка внутри матча)
      const withoutEvent = s.selections.filter((x) => x.eventId !== event.id);
      return {
        selections: [
          ...withoutEvent,
          {
            eventId: event.id,
            market,
            odds,
            eventLabel: `${event.home} — ${event.away}`,
            marketLabel,
          },
        ],
      };
    }),

  remove: (eventId, market) =>
    set((s) => ({
      selections: s.selections.filter(
        (x) => !(x.eventId === eventId && x.market === market),
      ),
    })),

  clear: () => set({ selections: [], stake: "" }),

  isSelected: (eventId, market) =>
    get().selections.some((x) => x.eventId === eventId && x.market === market),

  totalOdds: () => get().selections.reduce((acc, s) => acc * s.odds, 1),
}));
