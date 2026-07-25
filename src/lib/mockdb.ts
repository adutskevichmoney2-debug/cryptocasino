/**
 * МОК-«база» пользователей на localStorage.
 * ============================================================
 * TODO(backend): этот файл целиком удаляется при подключении Supabase.
 *  - Регистрация/вход        → supabase.auth.signUp / signInWithPassword
 *  - Профиль (avatar и т.д.) → таблица profiles + Supabase Storage
 *  - Сессии                  → supabase.auth.getSession / onAuthStateChange
 * ============================================================
 * Пароли даже в моке не хранятся открытым текстом — только SHA-256 хэш.
 */

export interface StoredUser {
  id: string;
  email: string;
  username: string;
  passHash: string;
  avatar: string | null; // dataURL; TODO(backend): URL из Supabase Storage
  createdAt: number;
}

const USERS_KEY = "cc_users_v1";

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const mockDb = {
  findByEmail(email: string): StoredUser | undefined {
    return readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  findByUsername(username: string): StoredUser | undefined {
    return readUsers().find((u) => u.username.toLowerCase() === username.toLowerCase());
  },
  findById(id: string): StoredUser | undefined {
    return readUsers().find((u) => u.id === id);
  },
  insert(user: StoredUser) {
    const users = readUsers();
    users.push(user);
    writeUsers(users);
  },
  update(id: string, patch: Partial<StoredUser>) {
    const users = readUsers();
    const i = users.findIndex((u) => u.id === id);
    if (i !== -1) {
      users[i] = { ...users[i], ...patch };
      writeUsers(users);
    }
  },
};
