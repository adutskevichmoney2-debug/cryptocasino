"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useUi, type ToastKind } from "@/lib/stores/ui";

const icons: Record<ToastKind, React.ReactNode> = {
  success: <CheckCircle2 size={18} className="text-em" />,
  error: <XCircle size={18} className="text-danger" />,
  info: <Info size={18} className="text-info" />,
};

const bars: Record<ToastKind, string> = {
  success: "bg-em",
  error: "bg-danger",
  info: "bg-info",
};

/** Маленькие всплывающие окна ошибок/успеха (по ТЗ — везде, где есть валидация) */
export function Toaster() {
  const { toasts, dismissToast } = useUi();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[200] flex flex-col items-center gap-2 px-3 sm:inset-x-auto sm:right-4 sm:top-4 sm:items-end">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="pointer-events-auto relative flex w-full max-w-[360px] items-start gap-3 overflow-hidden rounded-xl border border-line bg-raise/95 py-3 pl-4 pr-9 shadow-pop backdrop-blur"
          >
            <span className={`absolute inset-y-0 left-0 w-[3px] ${bars[t.kind]}`} />
            <span className="mt-px shrink-0">{icons[t.kind]}</span>
            <div className="min-w-0">
              <p className="text-[13.5px] font-bold leading-snug text-ink">{t.title}</p>
              {t.message && (
                <p className="mt-0.5 text-[12.5px] leading-snug text-sub">{t.message}</p>
              )}
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="absolute right-2.5 top-2.5 text-mute transition-colors hover:text-ink"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
