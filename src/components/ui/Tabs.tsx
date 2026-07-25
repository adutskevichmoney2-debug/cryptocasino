"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem<T extends string> {
  id: T;
  label: React.ReactNode;
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  className,
  layoutId,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  layoutId: string;
}) {
  return (
    <div className={cn("flex rounded-xl bg-field p-1", className)}>
      {items.map((it) => {
        const active = it.id === value;
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            className={cn(
              "relative flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-[13.5px] font-bold transition-colors",
              active ? "text-ink" : "text-mute hover:text-sub",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-lg bg-raise shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative z-10">{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
