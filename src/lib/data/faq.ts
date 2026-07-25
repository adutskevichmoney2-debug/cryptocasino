/**
 * FAQ — контент на русском и английском (как у крупных проектов, где
 * справочный контент покрывает основные языки, а UI переведён полностью).
 * Для остальных локалей показывается английская версия.
 */

export interface FaqItem {
  q: { ru: string; en: string };
  a: { ru: string; en: string };
}

export interface FaqCategory {
  id: "account" | "deposits" | "withdrawals" | "bonuses" | "security";
  items: FaqItem[];
}

export const FAQ: FaqCategory[] = [
  {
    id: "account",
    items: [
      {
        q: { ru: "Как создать аккаунт?", en: "How do I create an account?" },
        a: {
          ru: "Нажмите «Регистрация», укажите email, имя пользователя и пароль. Аккаунт создаётся мгновенно — верификация на старте не требуется.",
          en: "Click “Sign up”, enter your email, username and password. The account is created instantly — no verification is required to start.",
        },
      },
      {
        q: { ru: "Можно ли изменить имя пользователя?", en: "Can I change my username?" },
        a: {
          ru: "Имя пользователя фиксируется при регистрации. Если оно вам мешает — напишите в поддержку, мы поможем.",
          en: "The username is fixed at registration. If you need it changed, contact support and we'll help.",
        },
      },
      {
        q: { ru: "Как сменить язык сайта?", en: "How do I change the site language?" },
        a: {
          ru: "Нажмите на иконку глобуса в шапке сайта и выберите один из 10 доступных языков. Выбор сохраняется автоматически.",
          en: "Click the globe icon in the header and pick one of 10 available languages. Your choice is saved automatically.",
        },
      },
    ],
  },
  {
    id: "deposits",
    items: [
      {
        q: { ru: "Какие криптовалюты вы принимаете?", en: "Which cryptocurrencies do you accept?" },
        a: {
          ru: "BTC, ETH, USDT (TRC-20, ERC-20, BEP-20, TON, Solana, Polygon), USDC, BNB, SOL, TRX, TON, LTC, DOGE, XRP и ADA.",
          en: "BTC, ETH, USDT (TRC-20, ERC-20, BEP-20, TON, Solana, Polygon), USDC, BNB, SOL, TRX, TON, LTC, DOGE, XRP and ADA.",
        },
      },
      {
        q: { ru: "Как быстро зачисляется депозит?", en: "How fast are deposits credited?" },
        a: {
          ru: "Автоматически после необходимого числа подтверждений сети: обычно от нескольких секунд (TON, Solana) до 10–20 минут (Bitcoin).",
          en: "Automatically after the required network confirmations: usually from a few seconds (TON, Solana) up to 10–20 minutes (Bitcoin).",
        },
      },
      {
        q: { ru: "Есть ли комиссия на депозит?", en: "Is there a deposit fee?" },
        a: {
          ru: "Мы не берём комиссию за пополнение — вы платите только сетевую комиссию блокчейна.",
          en: "We don't charge deposit fees — you only pay the blockchain network fee.",
        },
      },
    ],
  },
  {
    id: "withdrawals",
    items: [
      {
        q: { ru: "Как долго обрабатывается вывод?", en: "How long do withdrawals take?" },
        a: {
          ru: "Большинство выводов обрабатывается автоматически в течение пары минут. Крупные суммы могут проходить дополнительную проверку до 24 часов.",
          en: "Most withdrawals are processed automatically within minutes. Large amounts may undergo an additional review of up to 24 hours.",
        },
      },
      {
        q: { ru: "Почему мой вывод отклонён?", en: "Why was my withdrawal declined?" },
        a: {
          ru: "Частые причины: неверный формат адреса, сумма меньше минимальной или не выполнен вейджер активного бонуса. Точную причину покажет окно вывода.",
          en: "Common reasons: invalid address format, amount below the minimum, or an active bonus wager not yet completed. The withdrawal window shows the exact reason.",
        },
      },
    ],
  },
  {
    id: "bonuses",
    items: [
      {
        q: { ru: "Что такое вейджер?", en: "What is wagering?" },
        a: {
          ru: "Вейджер — сколько раз нужно прокрутить бонус в ставках до вывода. Например, бонус 100 USDT с вейджером x40 требует ставок на 4 000 USDT.",
          en: "Wagering is how many times a bonus must be played through before withdrawal. E.g. a 100 USDT bonus with x40 wagering requires 4,000 USDT in bets.",
        },
      },
      {
        q: { ru: "Можно ли совмещать бонусы?", en: "Can bonuses be combined?" },
        a: {
          ru: "Одновременно может быть активен только один бонус с вейджером. Рейкбек начисляется всегда и с бонусами не конфликтует.",
          en: "Only one wagering bonus can be active at a time. Rakeback is always credited and doesn't conflict with bonuses.",
        },
      },
    ],
  },
  {
    id: "security",
    items: [
      {
        q: { ru: "Как вы защищаете мой аккаунт?", en: "How is my account protected?" },
        a: {
          ru: "Пароли хранятся только в виде хэшей, соединение шифруется TLS, доступна двухфакторная аутентификация (после подключения бэкенда).",
          en: "Passwords are stored as hashes only, connections are TLS-encrypted, and two-factor authentication is available (once the backend is connected).",
        },
      },
      {
        q: { ru: "Нужна ли верификация (KYC)?", en: "Is verification (KYC) required?" },
        a: {
          ru: "Для игры и небольших выводов — нет. KYC может потребоваться для крупных сумм по правилам лицензии.",
          en: "Not for playing and small withdrawals. KYC may be required for large amounts under licensing rules.",
        },
      },
    ],
  },
];
