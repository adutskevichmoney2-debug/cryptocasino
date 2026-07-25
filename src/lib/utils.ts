import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-aware class combiner */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Short unique id (client-side entities: toasts, transactions, bets) */
export function uid(prefix = "") {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** SHA-256 hex — used to avoid storing mock passwords in plain text.
 *  TODO(backend): remove entirely — Supabase Auth handles password hashing. */
export async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Format a crypto amount with the coin's precision, trimming trailing zeros */
export function formatAmount(value: number, maxDecimals = 8): string {
  if (!Number.isFinite(value)) return "0";
  const fixed = value.toFixed(maxDecimals);
  const trimmed = fixed.replace(/(\.\d*?[1-9])0+$|\.0+$/, "$1");
  return trimmed === "" ? "0" : trimmed;
}

/** 1234567.891 -> "1 234 567.89" */
export function formatFiat(value: number, decimals = 2): string {
  return value
    .toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    .replace(/,/g, " ");
}

/** Shorten a blockchain address / tx id: TQrY…9fXk */
export function shortAddress(addr: string, edge = 6): string {
  if (addr.length <= edge * 2 + 1) return addr;
  return `${addr.slice(0, edge)}…${addr.slice(-4)}`;
}

export function getInitials(name: string): string {
  return name
    .split(/[\s_.-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

/** Deterministic hue from a string (used for generated avatars) */
export function hashHue(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) % 360;
  return h;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const USERNAME_RE = /^[a-zA-Z0-9_]{3,16}$/;

/** Password strength 0..3 */
export function passwordStrength(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-ZА-Я]/.test(pw) && /[a-zа-я]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-zА-Яа-я0-9]/.test(pw)) s++;
  return s;
}

/** dd.mm.yyyy hh:mm */
export function formatDate(ts: number | string | Date, withTime = true): string {
  const d = new Date(ts);
  const date = `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
  if (!withTime) return date;
  return `${date} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
