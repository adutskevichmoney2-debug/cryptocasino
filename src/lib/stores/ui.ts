"use client";

import { create } from "zustand";
import { uid } from "@/lib/utils";

export type ModalId = "auth" | "wallet" | "search" | null;
export type AuthTab = "login" | "register" | "reset";
export type WalletTab = "deposit" | "withdraw" | "history";
export type ToastKind = "success" | "error" | "info";

export interface Toast {
  id: string;
  kind: ToastKind;
  title: string;
  message?: string;
}

interface UiState {
  modal: ModalId;
  authTab: AuthTab;
  walletTab: WalletTab;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  chatOpen: boolean;
  toasts: Toast[];
  openAuth: (tab?: AuthTab) => void;
  openWallet: (tab?: WalletTab) => void;
  openSearch: () => void;
  closeModal: () => void;
  toggleSidebar: () => void;
  setMobileMenu: (open: boolean) => void;
  setChat: (open: boolean) => void;
  toast: (kind: ToastKind, title: string, message?: string) => void;
  dismissToast: (id: string) => void;
}

export const useUi = create<UiState>()((set) => ({
  modal: null,
  authTab: "login",
  walletTab: "deposit",
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  chatOpen: false,
  toasts: [],

  openAuth: (tab = "login") => set({ modal: "auth", authTab: tab, mobileMenuOpen: false }),
  openWallet: (tab = "deposit") => set({ modal: "wallet", walletTab: tab, mobileMenuOpen: false }),
  openSearch: () => set({ modal: "search", mobileMenuOpen: false }),
  closeModal: () => set({ modal: null }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setMobileMenu: (open) => set({ mobileMenuOpen: open }),
  setChat: (open) => set({ chatOpen: open }),

  toast: (kind, title, message) =>
    set((s) => {
      const t: Toast = { id: uid("t_"), kind, title, message };
      // авто-скрытие
      setTimeout(() => {
        useUi.getState().dismissToast(t.id);
      }, 4200);
      return { toasts: [...s.toasts.slice(-3), t] };
    }),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
