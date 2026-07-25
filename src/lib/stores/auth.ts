"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mockDb } from "@/lib/mockdb";
import { EMAIL_RE, USERNAME_RE, sha256, uid } from "@/lib/utils";

/**
 * Авторизация (мок, клиент).
 * TODO(backend): заменить методы на вызовы Supabase Auth, стор оставить как
 * тонкую обёртку над onAuthStateChange. Коды ошибок совпадают с ключами i18n
 * (auth.err.*), поэтому UI менять не придётся.
 */

export interface SessionUser {
  id: string;
  /** Публичный числовой ID игрока (для поддержки). */
  playerId: number;
  email: string;
  username: string;
  avatar: string | null;
  createdAt: number;
}

export type AuthResult = { ok: true } | { ok: false; code: string };

interface AuthState {
  user: SessionUser | null;
  register: (p: { email: string; username: string; password: string }) => Promise<AuthResult>;
  login: (p: { email: string; password: string }) => Promise<AuthResult>;
  logout: () => void;
  setAvatar: (dataUrl: string | null) => void;
  changePassword: (current: string, next: string) => Promise<AuthResult>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      register: async ({ email, username, password }) => {
        if (!EMAIL_RE.test(email)) return { ok: false, code: "auth.err.emailInvalid" };
        if (!USERNAME_RE.test(username)) return { ok: false, code: "auth.err.usernameInvalid" };
        if (password.length < 8) return { ok: false, code: "auth.err.passwordShort" };
        if (mockDb.findByEmail(email)) return { ok: false, code: "auth.err.emailTaken" };
        if (mockDb.findByUsername(username)) return { ok: false, code: "auth.err.usernameTaken" };

        const stored = {
          id: uid("u_"),
          playerId: mockDb.nextPlayerId(),
          email,
          username,
          passHash: await sha256(password),
          avatar: null,
          createdAt: Date.now(),
        };
        mockDb.insert(stored);
        set({
          user: {
            id: stored.id,
            playerId: stored.playerId,
            email: stored.email,
            username: stored.username,
            avatar: null,
            createdAt: stored.createdAt,
          },
        });
        return { ok: true };
      },

      login: async ({ email, password }) => {
        if (!EMAIL_RE.test(email)) return { ok: false, code: "auth.err.emailInvalid" };
        const stored = mockDb.findByEmail(email);
        if (!stored) return { ok: false, code: "auth.err.wrongCredentials" };
        const hash = await sha256(password);
        if (hash !== stored.passHash) return { ok: false, code: "auth.err.wrongCredentials" };
        set({
          user: {
            id: stored.id,
            playerId: stored.playerId,
            email: stored.email,
            username: stored.username,
            avatar: stored.avatar,
            createdAt: stored.createdAt,
          },
        });
        return { ok: true };
      },

      logout: () => set({ user: null }),

      setAvatar: (dataUrl) => {
        const u = get().user;
        if (!u) return;
        mockDb.update(u.id, { avatar: dataUrl });
        set({ user: { ...u, avatar: dataUrl } });
      },

      changePassword: async (current, next) => {
        const u = get().user;
        if (!u) return { ok: false, code: "auth.err.generic" };
        const stored = mockDb.findById(u.id);
        if (!stored) return { ok: false, code: "auth.err.generic" };
        if ((await sha256(current)) !== stored.passHash)
          return { ok: false, code: "profile.wrongPassword" };
        if (next.length < 8) return { ok: false, code: "auth.err.passwordShort" };
        mockDb.update(u.id, { passHash: await sha256(next) });
        return { ok: true };
      },
    }),
    {
      name: "cc-session",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ user: s.user }),
      onRehydrateStorage: () => (state) => {
        // миграция старых сессий без playerId
        const u = state?.user;
        if (u && !u.playerId) {
          const stored = mockDb.findById(u.id);
          if (stored) {
            useAuth.setState({ user: { ...u, playerId: stored.playerId } });
          }
        }
      },
    },
  ),
);
