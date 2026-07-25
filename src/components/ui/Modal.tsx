"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHasMounted, useLockBody } from "@/lib/hooks";

const widths = {
  sm: "max-w-[420px]",
  md: "max-w-[520px]",
  lg: "max-w-[720px]",
  xl: "max-w-[920px]",
};

export function Modal({
  open,
  onClose,
  children,
  size = "md",
  title,
  noPadding,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: keyof typeof widths;
  title?: React.ReactNode;
  noPadding?: boolean;
}) {
  const mounted = useHasMounted();
  useLockBody(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
          <motion.div
            className="absolute inset-0 bg-black/65 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            className={cn(
              "relative z-10 max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-line bg-panel shadow-pop sm:rounded-2xl",
              widths[size],
            )}
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3.5 top-3.5 z-20 rounded-lg p-1.5 text-mute transition-colors hover:bg-raise hover:text-ink"
            >
              <X size={18} />
            </button>
            {title && (
              <div className="border-b border-line px-6 py-4.5 pr-12">
                <h3 className="text-[17px] font-extrabold tracking-tight">{title}</h3>
              </div>
            )}
            <div className={noPadding ? "" : "p-6"}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
