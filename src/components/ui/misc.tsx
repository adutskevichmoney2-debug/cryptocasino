"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Copy, Ghost } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCountdown } from "@/lib/hooks";
import { useI18n } from "@/lib/i18n/provider";

/* ---------- Switch ---------- */
export function Switch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-40",
        checked ? "bg-em" : "bg-raise",
      )}
    >
      <motion.span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
        animate={{ left: checked ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 34 }}
      />
    </button>
  );
}

/* ---------- Accordion item ---------- */
export function AccordionItem({
  title,
  children,
  defaultOpen,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="surface overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-[14.5px] font-bold text-ink">{title}</span>
        <ChevronDown
          size={18}
          className={cn("shrink-0 text-mute transition-transform duration-300", open && "rotate-180 text-em")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-5 pb-4 text-sm leading-relaxed text-sub">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Copy button ---------- */
export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();
  return (
    <button
      type="button"
      title={copied ? t("common.copied") : t("common.copy")}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-lg p-2 text-mute transition-colors hover:bg-raise hover:text-ink",
        copied && "text-em hover:text-em",
        className,
      )}
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
    </button>
  );
}

/* ---------- Empty state ---------- */
export function EmptyState({
  icon,
  title,
  hint,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  hint?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-14 text-center", className)}>
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-raise text-mute">
        {icon ?? <Ghost size={26} />}
      </div>
      <p className="text-[15px] font-bold text-ink">{title}</p>
      {hint && <p className="mt-1 max-w-[300px] text-[13px] leading-relaxed text-mute">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ---------- Progress bar ---------- */
export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-raise", className)}>
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-em-dim to-em"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/* ---------- Countdown ---------- */
export function Countdown({ target, className }: { target: number; className?: string }) {
  const { d, h, m, s } = useCountdown(target);
  const { t } = useI18n();
  const cell = (v: number, u: string) => (
    <span className="tnum inline-flex items-baseline gap-0.5">
      <b className="text-ink">{String(v).padStart(2, "0")}</b>
      <span className="text-[10px] font-semibold text-mute">{u}</span>
    </span>
  );
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm", className)}>
      {d > 0 && cell(d, t("tournaments.d"))}
      {cell(h, t("tournaments.h"))}
      {cell(m, t("tournaments.m"))}
      {cell(s, t("tournaments.s"))}
    </span>
  );
}
