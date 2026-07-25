/**
 * Криптовалюты и сети.
 * TODO(backend): minDeposit/minWithdraw/fee/usdRate должны приходить с бэкенда
 * (платёжный модуль + прайс-фид). Здесь — справочные значения для UI.
 */

export interface CoinNetwork {
  id: string;
  name: string;
  standard: string;
  minDeposit: number;
  minWithdraw: number;
  fee: number;
  confirmations: number;
  /** Валидация формата адреса на клиенте (второй рубеж — на бэкенде) */
  addressRegex: string;
  addressHint: string;
}

export interface Coin {
  symbol: string;
  name: string;
  color: string;
  decimals: number;
  /** Справочный курс для фиатного эквивалента в UI. TODO(backend): live-фид цен */
  usdRate: number;
  networks: CoinNetwork[];
}

const EVM = { regex: "^0x[a-fA-F0-9]{40}$", hint: "0x…" };
const TRON = { regex: "^T[1-9A-HJ-NP-Za-km-z]{33}$", hint: "T…" };
const SOLANA = { regex: "^[1-9A-HJ-NP-Za-km-z]{32,44}$", hint: "" };
const TONRE = { regex: "^(EQ|UQ)[A-Za-z0-9_-]{46}$", hint: "EQ… / UQ…" };

export const COINS: Coin[] = [
  {
    symbol: "USDT",
    name: "Tether",
    color: "#26A17B",
    decimals: 2,
    usdRate: 1,
    networks: [
      { id: "trc20", name: "Tron", standard: "TRC-20", minDeposit: 1, minWithdraw: 10, fee: 1, confirmations: 1, addressRegex: TRON.regex, addressHint: TRON.hint },
      { id: "erc20", name: "Ethereum", standard: "ERC-20", minDeposit: 10, minWithdraw: 20, fee: 4, confirmations: 12, addressRegex: EVM.regex, addressHint: EVM.hint },
      { id: "bep20", name: "BNB Smart Chain", standard: "BEP-20", minDeposit: 1, minWithdraw: 10, fee: 0.5, confirmations: 15, addressRegex: EVM.regex, addressHint: EVM.hint },
      { id: "ton", name: "TON", standard: "Jetton", minDeposit: 1, minWithdraw: 5, fee: 0.3, confirmations: 1, addressRegex: TONRE.regex, addressHint: TONRE.hint },
      { id: "sol", name: "Solana", standard: "SPL", minDeposit: 1, minWithdraw: 5, fee: 0.5, confirmations: 1, addressRegex: SOLANA.regex, addressHint: SOLANA.hint },
      { id: "polygon", name: "Polygon", standard: "ERC-20", minDeposit: 1, minWithdraw: 10, fee: 0.3, confirmations: 30, addressRegex: EVM.regex, addressHint: EVM.hint },
    ],
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    color: "#F7931A",
    decimals: 8,
    usdRate: 118000,
    networks: [
      {
        id: "btc", name: "Bitcoin", standard: "BTC", minDeposit: 0.00005, minWithdraw: 0.0002, fee: 0.00003, confirmations: 2,
        addressRegex: "^(1|3)[a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{25,59}$", addressHint: "bc1… / 1… / 3…",
      },
    ],
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    color: "#627EEA",
    decimals: 6,
    usdRate: 4200,
    networks: [
      { id: "erc20", name: "Ethereum", standard: "ETH", minDeposit: 0.002, minWithdraw: 0.005, fee: 0.0008, confirmations: 12, addressRegex: EVM.regex, addressHint: EVM.hint },
      { id: "arbitrum", name: "Arbitrum One", standard: "ETH", minDeposit: 0.0005, minWithdraw: 0.002, fee: 0.0002, confirmations: 1, addressRegex: EVM.regex, addressHint: EVM.hint },
      { id: "base", name: "Base", standard: "ETH", minDeposit: 0.0005, minWithdraw: 0.002, fee: 0.0002, confirmations: 1, addressRegex: EVM.regex, addressHint: EVM.hint },
    ],
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    color: "#2775CA",
    decimals: 2,
    usdRate: 1,
    networks: [
      { id: "erc20", name: "Ethereum", standard: "ERC-20", minDeposit: 10, minWithdraw: 20, fee: 4, confirmations: 12, addressRegex: EVM.regex, addressHint: EVM.hint },
      { id: "sol", name: "Solana", standard: "SPL", minDeposit: 1, minWithdraw: 5, fee: 0.5, confirmations: 1, addressRegex: SOLANA.regex, addressHint: SOLANA.hint },
      { id: "bep20", name: "BNB Smart Chain", standard: "BEP-20", minDeposit: 1, minWithdraw: 10, fee: 0.5, confirmations: 15, addressRegex: EVM.regex, addressHint: EVM.hint },
      { id: "polygon", name: "Polygon", standard: "ERC-20", minDeposit: 1, minWithdraw: 10, fee: 0.3, confirmations: 30, addressRegex: EVM.regex, addressHint: EVM.hint },
    ],
  },
  {
    symbol: "BNB",
    name: "BNB",
    color: "#F3BA2F",
    decimals: 5,
    usdRate: 950,
    networks: [
      { id: "bep20", name: "BNB Smart Chain", standard: "BEP-20", minDeposit: 0.005, minWithdraw: 0.01, fee: 0.0005, confirmations: 15, addressRegex: EVM.regex, addressHint: EVM.hint },
    ],
  },
  {
    symbol: "SOL",
    name: "Solana",
    color: "#9945FF",
    decimals: 4,
    usdRate: 210,
    networks: [
      { id: "sol", name: "Solana", standard: "SOL", minDeposit: 0.01, minWithdraw: 0.05, fee: 0.001, confirmations: 1, addressRegex: SOLANA.regex, addressHint: SOLANA.hint },
    ],
  },
  {
    symbol: "TRX",
    name: "Tron",
    color: "#EB0029",
    decimals: 2,
    usdRate: 0.36,
    networks: [
      { id: "trc20", name: "Tron", standard: "TRX", minDeposit: 10, minWithdraw: 30, fee: 1, confirmations: 1, addressRegex: TRON.regex, addressHint: TRON.hint },
    ],
  },
  {
    symbol: "TON",
    name: "Toncoin",
    color: "#0098EA",
    decimals: 4,
    usdRate: 6.4,
    networks: [
      { id: "ton", name: "TON", standard: "TON", minDeposit: 0.5, minWithdraw: 1, fee: 0.05, confirmations: 1, addressRegex: TONRE.regex, addressHint: TONRE.hint },
    ],
  },
  {
    symbol: "LTC",
    name: "Litecoin",
    color: "#345D9D",
    decimals: 6,
    usdRate: 130,
    networks: [
      {
        id: "ltc", name: "Litecoin", standard: "LTC", minDeposit: 0.005, minWithdraw: 0.01, fee: 0.001, confirmations: 3,
        addressRegex: "^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$|^ltc1[a-z0-9]{25,59}$", addressHint: "ltc1… / L… / M…",
      },
    ],
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    color: "#C2A633",
    decimals: 2,
    usdRate: 0.31,
    networks: [
      {
        id: "doge", name: "Dogecoin", standard: "DOGE", minDeposit: 10, minWithdraw: 30, fee: 2, confirmations: 6,
        addressRegex: "^D[5-9A-HJ-NP-U][1-9A-HJ-NP-Za-km-z]{32}$", addressHint: "D…",
      },
    ],
  },
  {
    symbol: "XRP",
    name: "XRP",
    color: "#3E92CC",
    decimals: 2,
    usdRate: 3.1,
    networks: [
      {
        id: "xrp", name: "XRP Ledger", standard: "XRP", minDeposit: 5, minWithdraw: 10, fee: 0.2, confirmations: 1,
        addressRegex: "^r[1-9A-HJ-NP-Za-km-z]{24,34}$", addressHint: "r…",
      },
    ],
  },
  {
    symbol: "ADA",
    name: "Cardano",
    color: "#2A71D0",
    decimals: 2,
    usdRate: 1.15,
    networks: [
      {
        id: "ada", name: "Cardano", standard: "ADA", minDeposit: 5, minWithdraw: 10, fee: 1, confirmations: 15,
        addressRegex: "^addr1[a-z0-9]{50,110}$", addressHint: "addr1…",
      },
    ],
  },
];

export const coinBySymbol = (symbol: string): Coin | undefined =>
  COINS.find((c) => c.symbol === symbol);
