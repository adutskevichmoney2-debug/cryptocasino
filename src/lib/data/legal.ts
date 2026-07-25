/**
 * Юридические документы — шаблоны на русском и английском.
 * ВАЖНО(license): перед запуском в продакшн тексты должен вычитать юрист;
 * плейсхолдеры [COMPANY], [JURISDICTION], [LICENSE NO.] заполняются после
 * регистрации компании и получения лицензии.
 */

export type LegalId = "terms" | "privacy" | "responsible-gambling" | "aml" | "fairness";

interface Bi {
  ru: string;
  en: string;
}

export interface LegalDoc {
  id: LegalId;
  titleKey: string;
  updated: string;
  sections: { h: Bi; body: Bi[] }[];
}

export const LEGAL: Record<LegalId, LegalDoc> = {
  terms: {
    id: "terms",
    titleKey: "legal.termsTitle",
    updated: "2026-07-01",
    sections: [
      {
        h: { ru: "1. Общие положения", en: "1. General Provisions" },
        body: [
          {
            ru: "Настоящие Условия использования регулируют отношения между оператором платформы CryptoCasino — компанией [COMPANY], зарегистрированной в юрисдикции [JURISDICTION] (лицензия № [LICENSE NO.]), — и пользователем. Регистрируясь на сайте, вы подтверждаете, что полностью прочитали и приняли настоящие Условия.",
            en: "These Terms of Service govern the relationship between the operator of the CryptoCasino platform — [COMPANY], registered in [JURISDICTION] (license No. [LICENSE NO.]) — and the user. By registering on the website you confirm that you have read and accepted these Terms in full.",
          },
          {
            ru: "Если вы не согласны с каким-либо положением Условий, вы должны прекратить использование платформы.",
            en: "If you disagree with any provision of these Terms, you must stop using the platform.",
          },
        ],
      },
      {
        h: { ru: "2. Аккаунт и допуск к игре", en: "2. Account and Eligibility" },
        body: [
          {
            ru: "Использовать платформу могут только лица, достигшие 18 лет (или иного возраста совершеннолетия, установленного законодательством страны проживания). Каждый пользователь может иметь только один аккаунт. При регистрации необходимо указывать достоверные данные и поддерживать их актуальность.",
            en: "The platform may only be used by persons aged 18 or older (or the age of majority in your country of residence). Each user may hold only one account. You must provide accurate information at registration and keep it up to date.",
          },
          {
            ru: "Пользователь несёт полную ответственность за сохранность своих учётных данных. Все действия, совершённые в аккаунте, считаются совершёнными его владельцем.",
            en: "You are fully responsible for keeping your credentials secure. All actions performed in the account are deemed to be performed by its owner.",
          },
        ],
      },
      {
        h: { ru: "3. Депозиты и выводы", en: "3. Deposits and Withdrawals" },
        body: [
          {
            ru: "Платформа принимает депозиты и осуществляет выплаты в криптовалютах, перечисленных в разделе «Кошелёк». Средства зачисляются после необходимого числа подтверждений сети. Сетевые комиссии блокчейна оплачивает пользователь.",
            en: "The platform accepts deposits and processes payouts in the cryptocurrencies listed in the Wallet section. Funds are credited after the required number of network confirmations. Blockchain network fees are paid by the user.",
          },
          {
            ru: "Оператор вправе запросить верификацию личности (KYC) до обработки вывода в случаях, предусмотренных политикой AML, и приостановить выплату до её завершения.",
            en: "The operator may request identity verification (KYC) before processing a withdrawal in the cases provided by the AML policy and suspend the payout until it is completed.",
          },
        ],
      },
      {
        h: { ru: "4. Бонусы", en: "4. Bonuses" },
        body: [
          {
            ru: "К бонусам применяются условия отыгрыша (вейджер), указанные в описании каждого бонуса. Злоупотребление бонусной программой — включая мультиаккаунтинг и схемы безрисковых ставок — ведёт к аннулированию бонусов и выигрышей, полученных с их использованием.",
            en: "Bonuses are subject to the wagering requirements specified in each bonus description. Abuse of the bonus program — including multi-accounting and risk-free betting schemes — results in the cancellation of bonuses and any winnings obtained with them.",
          },
        ],
      },
      {
        h: { ru: "5. Запрещённое использование", en: "5. Prohibited Use" },
        body: [
          {
            ru: "Запрещается: использование платформы лицами младше 18 лет; создание нескольких аккаунтов; использование чужих средств и платёжных реквизитов; любые формы мошенничества, сговора или использования программных средств для получения нечестного преимущества; доступ из юрисдикций, где азартные игры запрещены законом.",
            en: "The following is prohibited: use of the platform by persons under 18; creating multiple accounts; using third-party funds or payment details; any form of fraud, collusion or use of software to gain an unfair advantage; access from jurisdictions where gambling is prohibited by law.",
          },
        ],
      },
      {
        h: { ru: "6. Ограничение ответственности", en: "6. Limitation of Liability" },
        body: [
          {
            ru: "Платформа предоставляется «как есть». Оператор не несёт ответственности за убытки, вызванные перебоями связи, действиями третьих лиц, волатильностью криптовалют или обстоятельствами непреодолимой силы. Азартные игры связаны с риском потери средств — никогда не играйте на деньги, потерю которых не можете себе позволить.",
            en: "The platform is provided “as is”. The operator is not liable for losses caused by connectivity failures, actions of third parties, cryptocurrency volatility or force majeure. Gambling involves a risk of losing funds — never wager money you cannot afford to lose.",
          },
        ],
      },
      {
        h: { ru: "7. Изменения условий", en: "7. Changes to the Terms" },
        body: [
          {
            ru: "Оператор может изменять настоящие Условия. Новая редакция вступает в силу с момента публикации на сайте. Продолжение использования платформы означает согласие с изменениями.",
            en: "The operator may amend these Terms. The new version takes effect upon publication on the website. Continued use of the platform constitutes acceptance of the changes.",
          },
        ],
      },
    ],
  },

  privacy: {
    id: "privacy",
    titleKey: "legal.privacyTitle",
    updated: "2026-07-01",
    sections: [
      {
        h: { ru: "1. Какие данные мы собираем", en: "1. Data We Collect" },
        body: [
          {
            ru: "При регистрации и использовании платформы мы обрабатываем: email, имя пользователя, хэш пароля, IP-адрес, данные устройства и браузера, историю транзакций и игровой активности, а также документы, предоставленные при верификации (KYC).",
            en: "When you register and use the platform we process: email, username, password hash, IP address, device and browser data, transaction and gaming history, and documents provided during verification (KYC).",
          },
        ],
      },
      {
        h: { ru: "2. Цели обработки", en: "2. Purposes of Processing" },
        body: [
          {
            ru: "Данные используются для: предоставления сервиса и поддержки; исполнения требований AML/KYC; предотвращения мошенничества; улучшения продукта; отправки сервисных уведомлений. Маркетинговые рассылки отправляются только с вашего согласия.",
            en: "Data is used to: provide the service and support; comply with AML/KYC requirements; prevent fraud; improve the product; send service notifications. Marketing communications are sent only with your consent.",
          },
        ],
      },
      {
        h: { ru: "3. Хранение и защита", en: "3. Storage and Security" },
        body: [
          {
            ru: "Данные хранятся на защищённых серверах, соединения шифруются TLS, пароли — только в виде криптографических хэшей. Доступ к персональным данным имеют только уполномоченные сотрудники, связанные обязательством конфиденциальности.",
            en: "Data is stored on secured servers, connections are TLS-encrypted, and passwords are stored as cryptographic hashes only. Personal data is accessible only to authorized personnel bound by confidentiality obligations.",
          },
        ],
      },
      {
        h: { ru: "4. Cookies", en: "4. Cookies" },
        body: [
          {
            ru: "Мы используем cookies для авторизации, сохранения настроек (язык, предпочтения интерфейса) и аналитики. Вы можете ограничить использование cookies в настройках браузера, однако часть функций сайта может стать недоступной.",
            en: "We use cookies for authentication, remembering your preferences (language, interface settings) and analytics. You can restrict cookies in your browser settings, but some site features may become unavailable.",
          },
        ],
      },
      {
        h: { ru: "5. Передача третьим лицам", en: "5. Sharing with Third Parties" },
        body: [
          {
            ru: "Данные могут передаваться платёжным и KYC-провайдерам, а также государственным органам в случаях, прямо предусмотренных законом. Мы не продаём персональные данные.",
            en: "Data may be shared with payment and KYC providers, and with public authorities where expressly required by law. We do not sell personal data.",
          },
        ],
      },
      {
        h: { ru: "6. Ваши права", en: "6. Your Rights" },
        body: [
          {
            ru: "Вы вправе запросить доступ к своим данным, их исправление или удаление, а также отозвать согласие на обработку, написав в поддержку. Запросы обрабатываются в течение 30 дней.",
            en: "You may request access to, correction or deletion of your data, and withdraw consent to processing by contacting support. Requests are processed within 30 days.",
          },
        ],
      },
    ],
  },

  "responsible-gambling": {
    id: "responsible-gambling",
    titleKey: "legal.rgTitle",
    updated: "2026-07-01",
    sections: [
      {
        h: { ru: "Игра должна оставаться развлечением", en: "Gambling Should Stay Entertainment" },
        body: [
          {
            ru: "Азартные игры — это форма развлечения, а не способ заработка. Математическое преимущество всегда на стороне казино. Играйте только на средства, потерю которых можете себе позволить, и заранее определяйте лимит времени и бюджета.",
            en: "Gambling is a form of entertainment, not a way to make money. The mathematical edge is always with the house. Play only with funds you can afford to lose and set time and budget limits in advance.",
          },
        ],
      },
      {
        h: { ru: "Инструменты контроля", en: "Control Tools" },
        body: [
          {
            ru: "После подключения игрового модуля будут доступны: лимиты депозита (день/неделя/месяц), лимиты потерь, напоминания о времени в игре, тайм-аут и самоисключение на срок от 6 месяцев. Обратитесь в поддержку, чтобы активировать любой из инструментов вручную.",
            en: "Once the gaming module is connected, the following will be available: deposit limits (day/week/month), loss limits, session time reminders, time-out and self-exclusion from 6 months. Contact support to activate any tool manually.",
          },
        ],
      },
      {
        h: { ru: "Признаки проблемной игры", en: "Signs of Problem Gambling" },
        body: [
          {
            ru: "Насторожитесь, если вы: играете на последние или заёмные деньги; пытаетесь «отыграться»; скрываете игру от близких; испытываете тревогу или раздражение, когда не играете; забрасываете работу и обязанности ради игры.",
            en: "Warning signs include: playing with money you need or have borrowed; chasing losses; hiding your gambling from loved ones; feeling anxious or irritable when not playing; neglecting work and responsibilities in favor of gambling.",
          },
        ],
      },
      {
        h: { ru: "Куда обратиться за помощью", en: "Where to Get Help" },
        body: [
          {
            ru: "Бесплатную анонимную помощь оказывают международные организации: BeGambleAware (begambleaware.org), Gamblers Anonymous (gamblersanonymous.org), Gambling Therapy (gamblingtherapy.org). Если чувствуете, что теряете контроль — сделайте паузу и обратитесь к специалистам.",
            en: "Free, anonymous help is available from international organizations: BeGambleAware (begambleaware.org), Gamblers Anonymous (gamblersanonymous.org), Gambling Therapy (gamblingtherapy.org). If you feel you are losing control — take a break and reach out to professionals.",
          },
        ],
      },
      {
        h: { ru: "Защита несовершеннолетних", en: "Protection of Minors" },
        body: [
          {
            ru: "Использование платформы лицами младше 18 лет строго запрещено. Мы применяем возрастную проверку и рекомендуем родителям использовать программы родительского контроля (Netnanny, Cybersitter).",
            en: "Use of the platform by persons under 18 is strictly prohibited. We apply age verification and recommend parents use parental control software (Netnanny, Cybersitter).",
          },
        ],
      },
    ],
  },

  aml: {
    id: "aml",
    titleKey: "legal.amlTitle",
    updated: "2026-07-01",
    sections: [
      {
        h: { ru: "1. Назначение политики", en: "1. Purpose of the Policy" },
        body: [
          {
            ru: "Политика AML/KYC направлена на противодействие отмыванию денег и финансированию терроризма. Оператор придерживается риск-ориентированного подхода, соответствующего требованиям юрисдикции [JURISDICTION] и рекомендациям FATF.",
            en: "The AML/KYC policy is aimed at preventing money laundering and terrorism financing. The operator follows a risk-based approach consistent with the requirements of [JURISDICTION] and FATF recommendations.",
          },
        ],
      },
      {
        h: { ru: "2. Верификация (KYC)", en: "2. Verification (KYC)" },
        body: [
          {
            ru: "Верификация личности может быть запрошена: при выводе сумм свыше установленного лимита; при подозрительной активности; при возврате средств. Стандартный набор: документ, удостоверяющий личность, подтверждение адреса и селфи. Дополнительно может запрашиваться подтверждение источника средств.",
            en: "Identity verification may be requested: for withdrawals above the set limit; upon suspicious activity; for refunds. The standard set: an identity document, proof of address and a selfie. Proof of source of funds may additionally be requested.",
          },
        ],
      },
      {
        h: { ru: "3. Мониторинг операций", en: "3. Transaction Monitoring" },
        body: [
          {
            ru: "Все транзакции проходят автоматический мониторинг. Признаки подозрительной активности: депозиты без игровой активности с последующим выводом, дробление операций, использование адресов из санкционных списков и миксеров. Такие операции блокируются до выяснения обстоятельств.",
            en: "All transactions undergo automated monitoring. Suspicious indicators include: deposits without gaming activity followed by withdrawal, structuring of transactions, use of sanctioned addresses or mixers. Such operations are blocked pending review.",
          },
        ],
      },
      {
        h: { ru: "4. Ответственность", en: "4. Enforcement" },
        body: [
          {
            ru: "При выявлении нарушений оператор вправе приостановить аккаунт, заблокировать средства и передать информацию компетентным органам в порядке, установленном законом.",
            en: "Upon detection of violations the operator may suspend the account, freeze funds and report information to competent authorities as required by law.",
          },
        ],
      },
    ],
  },

  fairness: {
    id: "fairness",
    titleKey: "legal.fairnessTitle",
    updated: "2026-07-01",
    sections: [
      {
        h: { ru: "Лицензированные провайдеры", en: "Licensed Providers" },
        body: [
          {
            ru: "Все игры сторонних студий работают на серверах самих провайдеров: казино не имеет доступа к генератору случайных чисел и не может влиять на результат. RNG провайдеров сертифицирован независимыми лабораториями (iTech Labs, eCOGRA, GLI), а заявленный RTP публикуется в описании каждой игры.",
            en: "All third-party games run on the providers' own servers: the casino has no access to the random number generator and cannot influence outcomes. Provider RNGs are certified by independent labs (iTech Labs, eCOGRA, GLI), and the declared RTP is published in each game's description.",
          },
        ],
      },
      {
        h: { ru: "Provably Fair в Originals", en: "Provably Fair in Originals" },
        body: [
          {
            ru: "Игры CryptoCasino Originals используют механизм доказуемой честности: результат раунда определяется комбинацией серверного сида (хэш публикуется до раунда), клиентского сида (вы можете изменить его в любой момент) и номера раунда (nonce).",
            en: "CryptoCasino Originals use a provably fair mechanism: each round's outcome is determined by a combination of the server seed (its hash is published before the round), the client seed (you can change it at any time) and the round number (nonce).",
          },
          {
            ru: "После смены серверного сида предыдущий раскрывается, и вы можете самостоятельно проверить каждый сыгранный раунд по открытой формуле. Верификатор раундов появится в этом разделе вместе с запуском Originals.",
            en: "Once the server seed is rotated, the previous one is revealed, allowing you to independently verify every played round using the public formula. A round verifier will appear in this section together with the Originals launch.",
          },
        ],
      },
      {
        h: { ru: "Что такое RTP", en: "What RTP Means" },
        body: [
          {
            ru: "RTP (Return to Player) — доля всех ставок, которую игра в среднем возвращает игрокам на длинной дистанции. Например, RTP 96% означает, что на каждые 100 условных единиц ставок игра в среднем возвращает 96. RTP — статистическая величина и не гарантирует результат в отдельной сессии.",
            en: "RTP (Return to Player) is the share of all wagers a game returns to players on average over the long run. For example, an RTP of 96% means the game returns 96 for every 100 units wagered on average. RTP is a statistical value and does not guarantee results in any single session.",
          },
        ],
      },
    ],
  },
};
