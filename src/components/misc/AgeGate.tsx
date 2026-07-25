"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/provider";
import { usePrefs } from "@/lib/stores/prefs";
import { useHasMounted, useLockBody } from "@/lib/hooks";

/** Первый визит: подтверждение возраста 18+ */
export function AgeGate() {
  const { t } = useI18n();
  const mounted = useHasMounted();
  const { ageConfirmed, confirmAge } = usePrefs();
  const visible = mounted && !ageConfirmed;
  useLockBody(visible);

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-page/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            className="relative w-full max-w-[400px] rounded-2xl border border-line bg-panel p-7 text-center shadow-pop"
          >
            <LogoMark size={46} className="mx-auto" />
            <h2 className="mt-4 text-xl font-extrabold tracking-tight">{t("misc.ageTitle")}</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-sub">{t("misc.ageText")}</p>
            <div className="mt-6 grid gap-2">
              <Button size="lg" onClick={confirmAge}>
                {t("misc.ageYes")}
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => {
                  window.location.href = "https://www.google.com";
                }}
              >
                {t("misc.ageNo")}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
