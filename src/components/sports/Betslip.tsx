"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { EmptyState } from "@/components/ui/misc";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/stores/auth";
import { useBetslip } from "@/lib/stores/betslip";
import { useUi } from "@/lib/stores/ui";
import { useWallet } from "@/lib/stores/wallet";
import { useHasMounted } from "@/lib/hooks";
import { formatAmount } from "@/lib/utils";

export function BetslipCard({ onClose }: { onClose?: () => void }) {
  const { t } = useI18n();
  const { selections, stake, setStake, remove, clear, totalOdds } = useBetslip();
  const { user } = useAuth();
  const { openAuth, openWallet, toast } = useUi();
  const { activeCoin, balances } = useWallet();

  const stakeNum = parseFloat(stake.replace(",", ".")) || 0;
  const odds = totalOdds();
  const potential = stakeNum * odds;
  const mode = selections.length > 1 ? t("sports.express") : t("sports.single");

  const place = () => {
    // TODO(backend): POST /bets — серверная проверка коэффициентов и баланса
    if (!user) {
      toast("info", t("sports.loginToBet"));
      openAuth("login");
      return;
    }
    if (selections.length === 0 || stakeNum <= 0) {
      toast("error", t("common.error"), t("sports.emptyBetslipHint"));
      return;
    }
    if (stakeNum > (balances[activeCoin] ?? 0)) {
      toast("error", t("sports.insufficientBet"), t("wallet.insufficient"));
      openWallet("deposit");
      return;
    }
  };

  return (
    <div className="flex max-h-[calc(100dvh-120px)] flex-col overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-3.5">
        <ClipboardList size={17} className="text-em" />
        <h3 className="text-[14.5px] font-extrabold">{t("sports.betslip")}</h3>
        {selections.length > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-em px-1 text-[11px] font-extrabold text-[#04281b]">
            {selections.length}
          </span>
        )}
        <div className="ml-auto flex items-center gap-1">
          {selections.length > 0 && (
            <button
              onClick={clear}
              title={t("sports.clearAll")}
              className="rounded-lg p-1.5 text-mute transition-colors hover:bg-raise hover:text-danger"
            >
              <Trash2 size={15} />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-mute transition-colors hover:bg-raise hover:text-ink"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {selections.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={24} />}
          title={t("sports.emptyBetslip")}
          hint={t("sports.emptyBetslipHint")}
          className="py-10"
        />
      ) : (
        <>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            <AnimatePresence initial={false}>
              {selections.map((s) => (
                <motion.div
                  key={s.eventId + s.market}
                  layout
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.18 }}
                  className="rounded-xl bg-field p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[12px] font-bold leading-snug text-ink">{s.eventLabel}</p>
                    <button
                      onClick={() => remove(s.eventId, s.market)}
                      className="shrink-0 text-mute transition-colors hover:text-danger"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <p className="text-[11.5px] font-semibold text-mute">{s.marketLabel}</p>
                    <p className="tnum text-[13px] font-extrabold text-em">{s.odds.toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="space-y-3 border-t border-line p-3.5">
            <div className="flex items-center justify-between text-[12px] font-semibold text-mute">
              <span>{mode}</span>
              <span>
                {t("sports.totalOdds")}:{" "}
                <b className="tnum text-em">{odds.toFixed(2)}</b>
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <CoinIcon symbol={activeCoin} size={18} />
              </span>
              <input
                type="number"
                inputMode="decimal"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                placeholder={t("sports.stakeLabel")}
                className="h-11 w-full rounded-[10px] border border-line bg-field pl-10 pr-3.5 text-sm font-bold text-ink outline-none placeholder:font-normal placeholder:text-mute focus:border-em/70"
              />
            </div>
            <div className="flex items-center justify-between text-[12.5px]">
              <span className="font-semibold text-mute">{t("sports.potentialWin")}</span>
              <span className="tnum font-extrabold text-ink">
                {formatAmount(potential, 2)} {activeCoin}
              </span>
            </div>
            <Button fullWidth size="lg" onClick={place}>
              {t("sports.placeBet")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

/** Мобильная кнопка купона + шторка */
export function BetslipMobile() {
  const { t } = useI18n();
  const mounted = useHasMounted();
  const { selections, open, setOpen } = useBetslip();

  return (
    <>
      <AnimatePresence>
        {mounted && selections.length > 0 && !open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-24 left-4 z-[70] flex items-center gap-2 rounded-full bg-em px-4 py-3 text-[13px] font-extrabold text-[#04281b] shadow-glow lg:hidden"
          >
            <ClipboardList size={17} />
            {t("sports.betslip")}
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#04281b] px-1 text-[11px] text-em">
              {selections.length}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[95] lg:hidden">
            <motion.div
              className="absolute inset-0 bg-black/65"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
              className="absolute inset-x-0 bottom-0 p-2"
            >
              <BetslipCard onClose={() => setOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
