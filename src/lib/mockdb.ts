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
  /** Числовой публичный ID игрока (8 цифр) — для поддержки и профиля.
   *  TODO(backend): хранится в profiles.player_id; админ может менять
   *  (например, выдать красивый ID 77777777) — уникальность проверяет БД. */
  playerId: number;
  email: string;
  username: string;
  passHash: string;
  avatar: string | null; // dataURL; TODO(backend): URL из Supabase Storage
  createdAt: number;
}

const USERS_KEY = "cc_users_v1";

export function generatePlayerId(existing: StoredUser[]): number {
  // 8 цифр, без ведущего нуля
  for (let i = 0; i < 50; i++) {
    const id = Math.floor(10_000_000 + Math.random() * 90_000_000);
    if (!existing.some((u) => u.playerId === id)) return id;
  }
  return Date.now() % 100_000_000;
}

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const users = raw ? (JSON.parse(raw) as StoredUser[]) : [];
    // миграция: аккаунтам, созданным до появления playerId, выдаём ID
    let migrated = false;
    for (const u of users) {
      if (!u.playerId) {
        u.playerId = generatePlayerId(users);
        migrated = true;
      }
    }
    if (migrated) localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return users;
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const mockDb = {
  /** Уникальный числовой ID для нового игрока */
  nextPlayerId(): number {
    return generatePlayerId(readUsers());
  },
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
