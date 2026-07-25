# Карта интеграций бэкенда

Документ для этапа 2 (Vercel + Supabase + провайдеры). Каждый пункт: **что подключаем → где в коде → что менять**.

---

## 1. Аутентификация → Supabase Auth

**Файлы:** `src/lib/stores/auth.ts`, `src/lib/mockdb.ts` (удаляется целиком)

| Сейчас (мок) | Замена |
|---|---|
| `register()` — запись в localStorage | `supabase.auth.signUp({ email, password })` + запись `username` в таблицу `profiles` |
| `login()` — сверка SHA-256 хэша | `supabase.auth.signInWithPassword()` |
| `logout()` | `supabase.auth.signOut()` |
| сессия в `cc-session` | `supabase.auth.onAuthStateChange()` → тонкая обёртка в том же zustand-сторе |
| `ResetPane` в `components/modals/AuthModal.tsx` | `supabase.auth.resetPasswordForEmail()` |
| смена пароля в `profile/settings` | `supabase.auth.updateUser({ password })` |

Коды ошибок в сторе совпадают с ключами i18n (`auth.err.*`) — UI менять не нужно, только маппинг ошибок Supabase → эти коды.

**ID игрока:** у каждого пользователя есть публичный числовой `playerId` (8 цифр, генерируется при регистрации). На бэкенде — колонка `profiles.player_id` (unique); админ может менять ID игрока (например, выдать 77777777) — уникальность гарантирует constraint БД. Показывается в профиле, меню шапки, чате поддержки и на странице поддержки.

**2FA:** `profile/settings` → блок `TWO_FA_PLACEHOLDER` → Supabase Auth MFA (TOTP).

## 2. Профиль и аватар → Supabase Storage

**Файлы:** `src/components/profile/AvatarUpload.tsx`, `src/lib/stores/auth.ts` (`setAvatar`)

Сейчас dataURL в localStorage. Замена: upload в bucket `avatars` (путь `userId/avatar.webp`), публичный URL — в `profiles.avatar_url`. Даунскейл до 256×256 уже реализован на клиенте — оставить.

## 3. Баланс и транзакции → Supabase (RLS)

**Файлы:** `src/lib/stores/wallet.ts`

- Таблицы: `balances (user_id, coin, amount)`, `transactions (id, user_id, type, status, coin, amount, network, address, tx_hash, created_at)`.
- Стор превращается в кэш: `balances`/`transactions` подтягиваются запросом + Realtime-подписка.
- `requestWithdraw()` → `POST /api/withdrawals` (или RPC) — серверная валидация обязательна, клиентская остаётся как UX.
- Справочник монет/сетей `src/lib/data/coins.ts` (минималки, комиссии, `usdRate`) → отдаётся бэкендом; курс — прайс-фид (CoinGecko/Binance).

## 4. Депозиты → платёжный крипто-модуль

**Метка:** `PAYMENT_GATEWAY_EMBED` в `src/components/modals/WalletModal.tsx` (DepositPane)

Заменить dashed-блок на: запрос адреса `(userId, coin, network)` у платёжного провайдера (BTCPay / собственный кошелёк-сервис / кастодиальный API), рендер адреса + QR + копирование. Вебхук о подтверждении → инкремент `balances` + запись в `transactions` → баланс в шапке обновится сам (Realtime).

## 5. Игры → провайдер/агрегатор

**Метка:** `GAME_PROVIDER_EMBED` в `src/components/casino/GameView.tsx`

- Каталог `src/lib/data/games.ts` → каталог агрегатора (названия, обложки, RTP приходят от него).
- В `GameView` состояние `mode: "demo" | "real"` уже прокинуто — заменить заглушку на `<iframe src={launcherUrl}>`, где `launcherUrl` выдаёт бэкенд (session token игрока + gameId + mode).
- Обложки в `public/games/` — временные, заменяются CDN-ассетами провайдера.

## 6. Спорт → фид коэффициентов / виджет

**Метка:** `SPORTS_PROVIDER_EMBED` в `src/app/sports/page.tsx`

Вариант A (виджет): заменить список событий iframe-виджетом букмекерского модуля.
Вариант B (свой UI): `src/lib/data/sports.ts` → WS/REST фид; купон `src/lib/stores/betslip.ts` → `POST /api/bets` (серверная сверка коэффициентов). UI купона готов, включая ошибки.

## 7. Лента выигрышей

**Файл:** `src/lib/data/wins.ts` + `src/components/home/LiveWins.tsx`

Демо-массив (помечен бейджем в UI) → Supabase Realtime канал `wins` или WS. Бейдж «демо-данные» убрать после подключения.

## 8. Бонусы / VIP / Турниры / Рефералка

- Активация бонуса: `src/app/bonuses/page.tsx` (`claim()`) → API со статусами и вейджером.
- Промокоды: `PromoRedeem` в `src/app/bonuses/page.tsx`; сейчас валидация по мок-списку `VALID_PROMO_CODES` (`lib/data/promos.ts`) → заменить на `POST /promo/redeem` (таблица promo_codes: код, тип бонуса, лимит активаций, срок).
- VIP-прогресс: `src/app/vip/page.tsx` — `wagered` приходит из API (сейчас честный 0).
- Турниры: `src/lib/data/tournaments.ts` → API + Realtime лидерборды.
- Рефералка: `src/app/referral/page.tsx` — код/статистика из API (генерация ссылки уже на месте).

## 9. KYC

**Метка:** `KYC_PROVIDER_EMBED` в `src/app/profile/verification/page.tsx`
Sumsub/Veriff SDK или свой флоу на Supabase Storage + статусы (`none/pending/approved/rejected`) в `profiles`.

## 10. Чат поддержки

**Метка:** `SUPPORT_CHAT_EMBED` в `src/components/support/ChatWidget.tsx`
Intercom/Crisp/Chatwoot виджет или свой канал на Supabase Realtime. Форма обращений `src/app/support/page.tsx` → таблица `tickets`.

## 11. Лицензия

**Метка:** `LICENSE_INFO_PLACEHOLDER` в `src/components/layout/Footer.tsx` — номер лицензии, регулятор, валидатор-виджет. Плейсхолдеры `[COMPANY] / [JURISDICTION] / [LICENSE NO.]` в `src/lib/data/legal.ts`.

---

## Порядок работ (рекомендация)

1. Vercel deploy текущего репозитория (works out of the box).
2. Supabase Auth + profiles + Storage (пп. 1–2) — сайт становится по-настоящему многопользовательским.
3. Балансы/транзакции + платёжный модуль (пп. 3–4) — появляются реальные депозиты.
4. Игровой провайдер (п. 5), затем спорт (п. 6).
5. Остальное (пп. 7–11) — по мере роста.

Быстрый поиск всех точек: `grep -rn "TODO(backend)\|_EMBED\|LICENSE_INFO" src/`
