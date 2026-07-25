"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { COINS, coinBySymbol } from "@/lib/data/coins";
import { uid } from "@/lib/utils";

/**
 * Кошелёк (мок, клиент).
 * Баланс честный: все монеты = 0, пока не подключён бэкенд и реальные депозиты.
 * TODO(backend):
 *  - балансы и транзакции → таблицы Supabase (balances, transactions) + RLS
 *  - депозит → генерация адреса платёжным модулем (PAYMENT_GATEWAY)
 *  - вывод  → серверная валидация + очередь выплат
 */

export type TxType = "deposit" | "withdraw" | "bet" | "win" | "bonus";
export type TxStatus = "completed" | "pending" | "failed";

export interface Tx {
  id: string;
  type: TxType;
  status: TxStatus;
  coin: string;
  amount: number;
  network?: string;
  address?: string;
  createdAt: number;
}

export type WithdrawResult =
  | { ok: true }
  | { ok: false; code: string; vars?: Record<string, string | number> };

interface WalletState {
  balances: Record<string, number>;
  activeCoin: string;
  showFiat: boolean;
  transactions: Tx[];
  setActiveCoin: (symbol: string) => void;
  toggleFiat: () => void;
  totalUsd: () => number;
  requestWithdraw: (p: {
    coin: string;
    networkId: string;
    address: string;
    amount: number;
  }) => WithdrawResult;
}

const zeroBalances = Object.fromEntries(COINS.map((c) => [c.symbol, 0]));

export const useWallet = create<WalletState>()(
  persist(
    (set, get) => ({
      balances: { ...zeroBalances },
      activeCoin: "USDT",
      showFiat: true,
      transactions: [],

      setActiveCoin: (symbol) => set({ activeCoin: symbol }),
      toggleFiat: () => set((s) => ({ showFiat: !s.showFiat })),

      totalUsd: () => {
        const { balances } = get();
        return COINS.reduce((sum, c) => sum + (balances[c.symbol] ?? 0) * c.usdRate, 0);
      },

      requestWithdraw: ({ coin, networkId, address, amount }): WithdrawResult => {
        const meta = coinBySymbol(coin);
        const network = meta?.networks.find((n) => n.id === networkId);
        if (!meta || !network) return { ok: false, code: "auth.err.generic" };

        if (!new RegExp(network.addressRegex).test(address.trim())) {
          return {
            ok: false,
            code: "wallet.addressInvalid",
            vars: { network: `${network.name} (${network.standard})` },
          };
        }
        if (!(amount > 0) || amount < network.minWithdraw) {
          return {
            ok: false,
            code: "wallet.minWithdrawErr",
            vars: { min: network.minWithdraw, coin: meta.symbol },
          };
        }
        const balance = get().balances[coin] ?? 0;
        if (amount + network.fee > balance) {
          return { ok: false, code: "wallet.insufficient" };
        }

        // TODO(backend): POST /withdrawals — здесь лишь оптимистичная запись.
        set((s) => ({
          balances: { ...s.balances, [coin]: balance - amount - network.fee },
          transactions: [
            {
              id: uid("tx_"),
              type: "withdraw",
              status: "pending",
              coin,
              amount,
              network: `${network.name} (${network.standard})`,
              address,
              createdAt: Date.now(),
            },
            ...s.transactions,
          ],
        }));
        return { ok: true };
      },
    }),
    {
      name: "cc-wallet",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
