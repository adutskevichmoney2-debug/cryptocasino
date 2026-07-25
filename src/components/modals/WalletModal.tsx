"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Clock3, QrCode, TriangleAlert } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { EmptyState } from "@/components/ui/misc";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/stores/auth";
import { useUi, type WalletTab } from "@/lib/stores/ui";
import { useWallet } from "@/lib/stores/wallet";
import { COINS, coinBySymbol } from "@/lib/data/coins";
import { cn, formatAmount, formatDate, formatFiat, shortAddress } from "@/lib/utils";

function CoinPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (s: string) => void;
}) {
  const { t } = useI18n();
  const balances = useWallet((s) => s.balances);
  return (
    <div>
      <p className="mb-1.5 text-[13px] font-semibold text-sub">{t("wallet.coin")}</p>
      <div className="grid max-h-[168px] grid-cols-3 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-4">
        {COINS.map((c) => (
          <button
            key={c.symbol}
            onClick={() => onChange(c.symbol)}
            className={cn(
              "flex items-center gap-2 rounded-[10px] border px-2.5 py-2 transition-colors",
              value === c.symbol
                ? "border-em/60 bg-em/10"
                : "border-line bg-field hover:border-line2",
            )}
          >
            <CoinIcon symbol={c.symbol} size={20} />
            <span className="min-w-0 text-left">
              <span className="block truncate text-[12.5px] font-bold leading-tight text-ink">
                {c.symbol}
              </span>
              <span className="tnum block text-[10.5px] leading-tight text-mute">
                {formatAmount(balances[c.symbol] ?? 0, 4)}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function NetworkPicker({
  coin,
  value,
  onChange,
}: {
  coin: string;
  value: string;
  onChange: (id: string) => void;
}) {
  const { t } = useI18n();
  const meta = coinBySymbol(coin)!;
  return (
    <div>
      <p className="mb-1.5 text-[13px] font-semibold text-sub">{t("wallet.network")}</p>
      <div className="flex flex-wrap gap-1.5">
        {meta.networks.map((n) => (
          <button
            key={n.id}
            onClick={() => onChange(n.id)}
            className={cn(
              "rounded-[10px] border px-3 py-2 text-left transition-colors",
              value === n.id
                ? "border-em/60 bg-em/10"
                : "border-line bg-field hover:border-line2",
            )}
          >
            <span className="block text-[12.5px] font-bold leading-tight text-ink">
              {n.standard}
            </span>
            <span className="block text-[10.5px] leading-tight text-mute">{n.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============ Пополнение ============ */

function DepositPane() {
  const { t } = useI18n();
  const { activeCoin } = useWallet();
  const [coin, setCoin] = useState(activeCoin);
  const meta = coinBySymbol(coin)!;
  // выбор сети хранится вместе с монетой → при смене монеты сеть сама
  // "сбрасывается" на первую доступную (без эффектов)
  const [netSel, setNetSel] = useState<{ coin: string; id: string } | null>(null);
  const networkId = netSel && netSel.coin === coin ? netSel.id : meta.networks[0].id;
  const network = meta.networks.find((n) => n.id === networkId) ?? meta.networks[0];

  return (
    <div className="space-y-4">
      <CoinPicker value={coin} onChange={setCoin} />
      <NetworkPicker coin={coin} value={networkId} onChange={(id) => setNetSel({ coin, id })} />

      {/*
        ============================================================
        PAYMENT_GATEWAY_EMBED — точка интеграции платёжного модуля.
        TODO(backend): запросить у бэкенда депозитный адрес для
        (userId, coin, network) и отрисовать реальный QR + адрес c
        кнопкой копирования. Ничего, кроме этого блока, менять не нужно.
        ============================================================
      */}
      <div className="rounded-xl border border-dashed border-line2 bg-field/50 p-4">
        <p className="mb-3 text-[13px] font-semibold text-sub">{t("wallet.depositAddress")}</p>
        <div className="flex items-center gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-line bg-card text-mute">
            <QrCode size={34} strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-[13.5px] font-bold leading-snug text-ink">
              {t("wallet.addressPending")}
            </p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-mute">
              {t("wallet.addressPendingHint")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-[10px] bg-field px-3.5 py-2.5">
          <p className="text-[11px] font-semibold text-mute">{t("wallet.minDeposit")}</p>
          <p className="tnum mt-0.5 text-[13.5px] font-bold text-ink">
            {formatAmount(network.minDeposit, meta.decimals)} {meta.symbol}
          </p>
        </div>
        <div className="rounded-[10px] bg-field px-3.5 py-2.5">
          <p className="text-[11px] font-semibold text-mute">{t("common.status")}</p>
          <p className="mt-0.5 text-[13.5px] font-bold text-ink">
            {t("wallet.creditNote", { n: network.confirmations })}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============ Вывод ============ */

type FieldErrs = { address?: string; amount?: string };

function WithdrawPane() {
  const { t } = useI18n();
  const { activeCoin, balances, requestWithdraw } = useWallet();
  const toast = useUi((s) => s.toast);
  const [coin, setCoin] = useState(activeCoin);
  const meta = coinBySymbol(coin)!;
  // сеть и ошибки привязаны к текущей монете → смена монеты очищает их сама
  const [netSel, setNetSel] = useState<{ coin: string; id: string } | null>(null);
  const networkId = netSel && netSel.coin === coin ? netSel.id : meta.networks[0].id;
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [errState, setErrState] = useState<{ coin: string; errs: FieldErrs }>({ coin, errs: {} });
  const fieldErr: FieldErrs = errState.coin === coin ? errState.errs : {};
  const setFieldErr = (errs: FieldErrs) => setErrState({ coin, errs });

  const network = meta.networks.find((n) => n.id === networkId) ?? meta.networks[0];
  const balance = balances[coin] ?? 0;
  const parsed = parseFloat(amount.replace(",", "."));
  const receive = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;

  const submit = () => {
    setFieldErr({});
    const res = requestWithdraw({
      coin,
      networkId,
      address,
      amount: Number.isFinite(parsed) ? parsed : 0,
    });
    if (!res.ok) {
      const msg = t(res.code, res.vars);
      if (res.code === "wallet.addressInvalid") setFieldErr({ address: msg });
      else if (res.code === "wallet.minWithdrawErr") setFieldErr({ amount: msg });
      else if (res.code === "wallet.insufficient") setFieldErr({ amount: msg });
      toast("error", t("common.error"), msg);
      return;
    }
    toast("success", t("common.success"), `${t("wallet.txType.withdraw")}: ${amount} ${coin}`);
    setAddress("");
    setAmount("");
  };

  return (
    <div className="space-y-4">
      <CoinPicker value={coin} onChange={setCoin} />
      <NetworkPicker coin={coin} value={networkId} onChange={(id) => setNetSel({ coin, id })} />

      <Input
        label={`${t("wallet.address")} · ${network.name} (${network.standard})`}
        placeholder={
          network.addressHint
            ? `${t("wallet.addressPlaceholder", { network: network.standard })} · ${network.addressHint}`
            : t("wallet.addressPlaceholder", { network: network.standard })
        }
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        error={fieldErr.address}
      />

      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <p className="text-[13px] font-semibold text-sub">{t("wallet.amount")}</p>
          <p className="tnum text-[12px] text-mute">
            {t("wallet.available")}:{" "}
            <button
              className="font-bold text-em hover:underline"
              onClick={() => setAmount(String(balance))}
            >
              {formatAmount(balance, meta.decimals)} {coin}
            </button>
          </p>
        </div>
        <Input
          type="number"
          inputMode="decimal"
          placeholder={`${t("common.min")}: ${formatAmount(network.minWithdraw, meta.decimals)} ${coin}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={fieldErr.amount}
        />
      </div>

      <div className="space-y-1.5 rounded-[10px] bg-field px-3.5 py-3 text-[12.5px]">
        <div className="flex justify-between">
          <span className="text-mute">{t("wallet.fee")}</span>
          <span className="tnum font-bold text-ink">
            {formatAmount(network.fee, meta.decimals)} {coin}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-mute">{t("wallet.youReceive")}</span>
          <span className="tnum font-bold text-em">
            {formatAmount(receive, meta.decimals)} {coin} · ${formatFiat(receive * meta.usdRate)}
          </span>
        </div>
      </div>

      {balance === 0 && (
        <p className="flex items-start gap-2 rounded-[10px] bg-warn/10 px-3.5 py-2.5 text-[12px] font-semibold leading-snug text-warn">
          <TriangleAlert size={15} className="mt-px shrink-0" />
          {t("wallet.insufficient")}
        </p>
      )}

      {/* TODO(backend): POST /withdrawals + серверная валидация и очередь выплат */}
      <Button fullWidth size="lg" onClick={submit}>
        {t("wallet.requestWithdraw")}
      </Button>
    </div>
  );
}

/* ============ История ============ */

function HistoryPane() {
  const { t } = useI18n();
  const transactions = useWallet((s) => s.transactions);
  const openWallet = useUi((s) => s.openWallet);

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<Clock3 size={26} />}
        title={t("wallet.noTx")}
        hint={t("wallet.noTxHint")}
        action={
          <Button size="sm" onClick={() => openWallet("deposit")}>
            {t("common.deposit")}
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-1.5">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-center gap-3 rounded-[10px] bg-field px-3.5 py-3">
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              tx.type === "deposit" ? "bg-em/15 text-em" : "bg-raise text-sub",
            )}
          >
            {tx.type === "deposit" ? <ArrowDownToLine size={16} /> : <ArrowUpFromLine size={16} />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-ink">
              {t(`wallet.txType.${tx.type}`)}
              {tx.network ? ` · ${tx.network}` : ""}
            </p>
            <p className="text-[11.5px] text-mute">
              {formatDate(tx.createdAt)}
              {tx.address ? ` · ${shortAddress(tx.address)}` : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="tnum text-[13px] font-bold text-ink">
              {tx.type === "deposit" ? "+" : "−"}
              {formatAmount(tx.amount, 8)} {tx.coin}
            </p>
            <p
              className={cn(
                "text-[11px] font-bold",
                tx.status === "completed" && "text-em",
                tx.status === "pending" && "text-warn",
                tx.status === "failed" && "text-danger",
              )}
            >
              {t(`wallet.txStatus.${tx.status}`)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============ Модалка ============ */

export function WalletModal() {
  const { t } = useI18n();
  const { modal, walletTab, closeModal, openAuth } = useUi();
  const user = useAuth((s) => s.user);
  const open = modal === "wallet";

  // Кошелёк доступен только авторизованным: перенаправляем в окно входа.
  // Вызовы zustand-экшенов — синхронизация с внешним стором, не setState React.
  useEffect(() => {
    if (open && !user) {
      closeModal();
      openAuth("login");
    }
  }, [open, user, closeModal, openAuth]);

  if (!user) return null;

  return (
    <Modal open={open} onClose={closeModal} size="md" title={t("wallet.title")} noPadding>
      {/* key: при открытии с конкретной вкладкой содержимое монтируется заново */}
      <WalletBody key={walletTab} initial={walletTab} />
    </Modal>
  );
}

function WalletBody({ initial }: { initial: WalletTab }) {
  const { t } = useI18n();
  const [tab, setTab] = useState<WalletTab>(initial);

  const items = useMemo(
    () => [
      { id: "deposit" as const, label: t("wallet.deposit") },
      { id: "withdraw" as const, label: t("wallet.withdraw") },
      { id: "history" as const, label: t("wallet.history") },
    ],
    [t],
  );

  return (
    <div className="p-5 sm:p-6">
      <Tabs<WalletTab> layoutId="wallet-tabs" className="mb-5" items={items} value={tab} onChange={setTab} />
      {tab === "deposit" && <DepositPane />}
      {tab === "withdraw" && <WithdrawPane />}
      {tab === "history" && <HistoryPane />}
    </div>
  );
}
