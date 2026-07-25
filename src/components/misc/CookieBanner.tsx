"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/provider";
import { usePrefs } from "@/lib/stores/prefs";
import { useHasMounted } from "@/lib/hooks";

export function CookieBanner() {
  const { t } = useI18n();
  const mounted = useHasMounted();
  const { cookieChoice, setCookieChoice } = usePrefs();

  const visible = mounted && cookieChoice === null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 320, damping: 30, delay: 0.6 }}
          className="fixed bottom-20 left-3 right-3 z-[80] mx-auto flex max-w-[560px] flex-col gap-3 rounded-2xl border border-line bg-raise/95 p-4 shadow-pop backdrop-blur sm:flex-row sm:items-center lg:bottom-5"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-em/15 text-em">
            <Cookie size={19} />
          </span>
          <p className="flex-1 text-[12.5px] leading-snug text-sub">{t("misc.cookieText")}</p>
          <div className="flex shrink-0 gap-2">
            <Button size="sm" variant="secondary" onClick={() => setCookieChoice("essential")}>
              {t("misc.cookieDecline")}
            </Button>
            <Button size="sm" onClick={() => setCookieChoice("accepted")}>
              {t("misc.cookieAccept")}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
