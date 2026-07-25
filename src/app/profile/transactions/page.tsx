"use client";

import { ArrowDownToLine, ArrowUpFromLine, Receipt } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/misc";
import { useI18n } from "@/lib/i18n/provider";
import { useUi } from "@/lib/stores/ui";
import { useWallet } from "@/lib/stores/wallet";
import { cn, formatAmount, formatDate, shortAddress } from "@/lib/utils";

export default function TransactionsPage() {
  const { t } = useI18n();
  const transactions = useWallet((s) => s.transactions);
  const openWallet = useUi((s) => s.openWallet);

  if (transactions.length === 0) {
    return (
      <div className="surface">
        <EmptyState
          icon={<Receipt size={26} />}
          title={t("wallet.noTx")}
          hint={t("wallet.noTxHint")}
          action={
            <Button size="sm" onClick={() => openWallet("deposit")}>
              {t("common.deposit")}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="surface overflow-x-auto">
      <table className="w-full min-w-[680px] text-left">
        <thead>
          <tr className="border-b border-line text-[11px] font-extrabold uppercase tracking-wider text-mute">
            <th className="px-5 py-3.5">{t("common.type")}</th>
            <th className="px-4 py-3.5">{t("common.date")}</th>
            <th className="px-4 py-3.5">{t("wallet.network")}</th>
            <th className="px-4 py-3.5 text-right">{t("common.amount")}</th>
            <th className="px-5 py-3.5 text-right">{t("common.status")}</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-line/60 text-[13px] font-semibold last:border-0">
              <td className="px-5 py-3.5">
                <span className="flex items-center gap-2.5 font-bold">
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      tx.type === "deposit" ? "bg-em/15 text-em" : "bg-raise text-sub",
                    )}
                  >
                    {tx.type === "deposit" ? <ArrowDownToLine size={15} /> : <ArrowUpFromLine size={15} />}
                  </span>
                  {t(`wallet.txType.${tx.type}`)}
                </span>
              </td>
              <td className="tnum px-4 py-3.5 text-sub">{formatDate(tx.createdAt)}</td>
              <td className="px-4 py-3.5 text-sub">
                {tx.network ?? "—"}
                {tx.address && <span className="ml-1.5 text-mute">{shortAddress(tx.address)}</span>}
              </td>
              <td className="tnum px-4 py-3.5 text-right font-extrabold">
                {tx.type === "deposit" ? "+" : "−"}
                {formatAmount(tx.amount, 8)} {tx.coin}
              </td>
              <td
                className={cn(
                  "px-5 py-3.5 text-right font-bold",
                  tx.status === "completed" && "text-em",
                  tx.status === "pending" && "text-warn",
                  tx.status === "failed" && "text-danger",
                )}
              >
                {t(`wallet.txStatus.${tx.status}`)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
