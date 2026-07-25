"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  QrCode,
  Search,
  ShieldCheck,
  Timer,
  TriangleAlert,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { Dropdown } from "@/components/ui/Dropdown";
import { EmptyState } from "@/components/ui/misc";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/stores/auth";
import { useUi, type WalletTab } from "@/lib/stores/ui";
import { useWallet } from "@/lib/stores/wallet";
import { COINS, coinBySymbol, type Coin } from "@/lib/data/coins";
import { cn, formatAmount, formatDate, formatFiat, shortAddress } from "@/lib/utils";

/* ============ Селектор монеты (поиск + балансы) ============ */

function CoinMenu({
  onPick,
}: {
  onPick: (symbol: string) => void;
}) {
  const { t } = useI18n();
  const balances = useWallet((s) => s.balances);
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return COINS;
    return COINS.filter(
      (c) => c.symbol.toLowerCase().includes(query) || c.name.toLowerCase().includes(query),
    );
  }, [q]);

  return (
    <div>
      <div className="border-b border-line p-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("wallet.searchCoin")}
            className="h-9 w-full rounded-lg border border-line bg-field pl-9 pr-3 text-[13px] text-ink outline-none placeholder:text-mute focus:border-em/60"
          />
        </div>
      </div>
      <div className="max-h-[264px] overflow-y-auto p-1.5">
        {list.length === 0 ? (
          <p className="px-3 py-6 text-center text-[12.5px] text-mute">{t("common.nothingFound")}</p>
        ) : (
          list.map((c) => {
            const b = balances[c.symbol] ?? 0;
            return (
              <button
                key={c.symbol}
                onClick={() => onPick(c.symbol)}
                className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-hover"
              >
                <CoinIcon symbol={c.symbol} size={26} />
                <span className="min-w-0 flex-1 text-left">
                  <span className="block text-[13px] font-extrabold leading-tight text-ink">
                    {c.symbol}
                  </span>
                  <span className="block truncate text-[11px] leading-tight text-mute">
                    {c.name}
                  </span>
                </span>
                <span className="text-right">
                  <span className="tnum block text-[12.5px] font-bold leading-tight text-ink">
                    {formatAmount(b, c.decimals)}
                  </span>
                  <span className="tnum block text-[10.5px] leading-tight text-mute">
                    ${formatFiat(b * c.usdRate)}
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function CoinSelect({ value, onChange }: { value: string; onChange: (s: string) => void }) {
  const { t } = useI18n();
  const balances = useWallet((s) => s.balances);
  const coin = coinBySymbol(value)!;
  const balance = balances[value] ?? 0;

  return (
    <div>
      <p className="mb-1.5 text-[13px] font-semibold text-sub">{t("wallet.coin")}</p>
      <Dropdown
        align="left"
        width="w-full"
        trigger={(open) => (
          <button
            className={cn(
              "flex h-[54px] w-full items-center gap-3 rounded-xl border bg-field px-3.5 transition-colors",
              open ? "border-em/60" : "border-line hover:border-line2",
            )}
          >
            <CoinIcon symbol={value} size={28} />
            <span className="min-w-0 flex-1 text-left">
              <span className="block text-[14px] font-extrabold leading-tight text-ink">
                {coin.symbol}
              </span>
              <span className="block truncate text-[11.5px] leading-tight text-mute">
                {coin.name}
              </span>
            </span>
            <span className="text-right">
              <span className="tnum block text-[13px] font-bold leading-tight text-ink">
                {formatAmount(balance, coin.decimals)}
              </span>
              <span className="tnum block text-[11px] leading-tight text-mute">
                ${formatFiat(balance * coin.usdRate)}
              </span>
            </span>
            <ChevronDown
              size={16}
              className={cn("shrink-0 text-mute transition-transform", open && "rotate-180")}
            />
          </button>
        )}
      >
        {(close) => (
          <CoinMenu
            onPick={(s) => {
              onChange(s);
              close();
            }}
          />
        )}
      </Dropdown>
    </div>
  );
}

/* ============ Селектор сети ============ */

function NetworkPicker({
  coin,
  value,
  onChange,
}: {
  coin: Coin;
  value: string;
  onChange: (id: string) => void;
}) {
  const { t } = useI18n();
  return (
    <div>
      <p className="mb-1.5 text-[13px] font-semibold text-sub">{t("wallet.network")}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {coin.networks.map((n) => {
          const active = value === n.id;
          return (
            <button
              key={n.id}
              onClick={() => onChange(n.id)}
              className={cn(
                "relative rounded-xl border px-3 py-2.5 text-left transition-all",
                active
                  ? "border-em/70 bg-em/10"
                  : "border-line bg-field hover:border-line2",
              )}
            >
              <span className={cn("block text-[13px] font-extrabold leading-tight", active ? "text-em" : "text-ink")}>
                {n.standard}
              </span>
              <span className="mt-0.5 block truncate text-[11px] leading-tight text-mute">
                {n.name}
              </span>
              {active && <Check size={13} className="absolute right-2 top-2 text-em" />}
            </button>
          );
        })}
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
      <CoinSelect value={coin} onChange={setCoin} />
      <NetworkPicker coin={meta} value={networkId} onChange={(id) => setNetSel({ coin, id })} />

      {/*
        ============================================================
        PAYMENT_GATEWAY_EMBED — точка интеграции платёжного модуля.
        TODO(backend): запросить у бэкенда депозитный адрес для
        (userId, coin, network), отрисовать реальный QR и адрес,
        включить кнопку копирования. Меняется только этот блок.
        ============================================================
      */}
      <div className="rounded-xl border border-line bg-panel p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex h-[104px] w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-field">
            <QrCode size={40} strokeWidth={1.3} className="text-mute/70" />
            <span className="absolute inset-x-0 bottom-0 bg-raise/90 py-0.5 text-center text-[9px] font-extrabold uppercase tracking-wider text-mute">
              {t("common.comingSoon")}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-semibold text-sub">
              {t("wallet.depositAddress")} · {network.standard}
            </p>
            <div className="mt-2 flex h-11 items-center gap-2 rounded-[10px] border border-dashed border-line2 bg-field px-3.5">
              <span className="min-w-0 flex-1 truncate text-[12.5px] text-mute">
                {t("wallet.addressPending")}
              </span>
              <Copy size={14} className="shrink-0 text-mute/50" />
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-mute">
              {t("wallet.addressPendingHint")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex items-center gap-2.5 rounded-xl border border-line bg-field px-3.5 py-3">
          <ArrowDownToLine size={16} className="shrink-0 text-em" />
          <span>
            <span className="block text-[10.5px] font-semibold uppercase tracking-wide text-mute">
              {t("wallet.minDeposit")}
            </span>
            <span className="tnum block text-[13px] font-extrabold text-ink">
              {formatAmount(network.minDeposit, meta.decimals)} {meta.symbol}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border border-line bg-field px-3.5 py-3">
          <Timer size={16} className="shrink-0 text-em" />
          <span>
            <span className="block text-[10.5px] font-semibold uppercase tracking-wide text-mute">
              {t("common.status")}
            </span>
            <span className="block text-[12px] font-bold leading-tight text-ink">
              {t("wallet.creditNote", { n: network.confirmations })}
            </span>
          </span>
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
      <CoinSelect value={coin} onChange={setCoin} />
      <NetworkPicker coin={meta} value={networkId} onChange={(id) => setNetSel({ coin, id })} />

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
            <b className="text-sub">
              {formatAmount(balance, meta.decimals)} {coin}
            </b>
          </p>
        </div>
        <div className="relative">
          <input
            type="number"
            inputMode="decimal"
            placeholder={`${t("common.min")}: ${formatAmount(network.minWithdraw, meta.decimals)}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={cn(
              "tnum h-12 w-full rounded-xl border bg-field pl-3.5 pr-24 text-[14px] font-bold text-ink outline-none transition-colors placeholder:font-normal placeholder:text-mute",
              fieldErr.amount ? "border-danger/70 focus:border-danger" : "border-line focus:border-em/70",
            )}
          />
          <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-2">
            <button
              type="button"
              onClick={() => setAmount(String(balance))}
              className="rounded-md bg-raise px-2 py-1 text-[11px] font-extrabold text-em transition-colors hover:bg-hover"
            >
              {t("common.max").toUpperCase()}
            </button>
            <span className="text-[12px] font-bold text-mute">{coin}</span>
          </div>
        </div>
        {fieldErr.amount && (
          <p className="mt-1.5 text-xs font-medium text-danger">{fieldErr.amount}</p>
        )}
      </div>

      <div className="divide-y divide-line rounded-xl border border-line bg-panel">
        <div className="flex items-center justify-between px-4 py-2.5 text-[12.5px]">
          <span className="text-mute">{t("wallet.fee")}</span>
          <span className="tnum font-bold text-ink">
            {formatAmount(network.fee, meta.decimals)} {coin}
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 text-[12.5px]">
          <span className="text-mute">{t("wallet.youReceive")}</span>
          <span className="tnum font-extrabold text-em">
            {formatAmount(receive, meta.decimals)} {coin}
            <span className="ml-1.5 font-semibold text-mute">
              ≈ ${formatFiat(receive * meta.usdRate)}
            </span>
          </span>
        </div>
      </div>

      {balance === 0 && (
        <p className="flex items-start gap-2.5 rounded-xl border border-warn/25 bg-warn/10 px-3.5 py-3 text-[12px] font-semibold leading-snug text-warn">
          <TriangleAlert size={15} className="mt-px shrink-0" />
          {t("wallet.insufficient")}
        </p>
      )}

      {/* TODO(backend): POST /withdrawals + серверная валидация и очередь выплат */}
      <Button fullWidth size="lg" onClick={submit}>
        <ShieldCheck size={16} />
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
        <div key={tx.id} className="flex items-center gap-3 rounded-xl border border-line bg-field px-3.5 py-3">
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
