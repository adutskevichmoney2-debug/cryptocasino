"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Club,
  Dice5,
  Gem,
  Gift,
  Landmark,
  Radio,
  ShieldCheck,
  Sparkles,
  Timer,
  Trophy,
  Tv,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { GameRow } from "@/components/casino/GameRow";
import { LiveWins } from "@/components/home/LiveWins";
import { OddsButton } from "@/components/sports/OddsButton";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/stores/auth";
import { useUi } from "@/lib/stores/ui";
import { useHasMounted } from "@/lib/hooks";
import { COINS } from "@/lib/data/coins";
import { GAMES, PROVIDERS } from "@/lib/data/games";
import { liveEvents } from "@/lib/data/sports";

function Hero() {
  const { t } = useI18n();
  const user = useAuth((s) => s.user);
  const { openAuth } = useUi();
  const mounted = useHasMounted();

  return (
    <section className="relative -mx-4 mb-10 overflow-hidden border-b border-line sm:-mx-6">
      <div className="absolute inset-0">
        <Image
          src="/images/hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-page via-page/92 to-page/35" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[620px]"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-em/30 bg-em/10 px-3.5 py-1.5 text-[12px] font-extrabold text-em">
            <Wallet size={13} />
            {t("home.heroBadge")}
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-[56px]">
            {t("home.heroTitle1")}
            <br />
            <span className="text-em-gradient">{t("home.heroTitle2")}</span>
          </h1>
          <p className="mt-5 max-w-[480px] text-[15px] leading-relaxed text-sub">
            {t("home.heroText")}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {mounted && !user ? (
              <Button size="lg" onClick={() => openAuth("register")}>
                {t("home.heroCta")}
                <ArrowRight size={17} />
              </Button>
            ) : (
              <Link href="/casino">
                <Button size="lg">
                  {t("home.heroCta")}
                  <ArrowRight size={17} />
                </Button>
              </Link>
            )}
            <Link href="/casino">
              <Button size="lg" variant="outline">
                {t("home.heroCta2")}
              </Button>
            </Link>
          </div>
          <div className="mt-9 flex items-center gap-1.5">
            {COINS.slice(0, 8).map((c) => (
              <CoinIcon key={c.symbol} symbol={c.symbol} size={26} className="ring-2 ring-page" />
            ))}
            <span className="ml-1.5 text-[12.5px] font-bold text-mute">+{COINS.length - 8}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CategoryCards() {
  const { t } = useI18n();
  const cats = [
    { href: "/casino?cat=slots", icon: <Sparkles size={22} />, label: t("nav.slots"), count: GAMES.filter((g) => g.category === "slots").length },
    { href: "/casino?cat=live", icon: <Radio size={22} />, label: t("nav.liveCasino"), count: GAMES.filter((g) => g.category === "live").length },
    { href: "/casino?cat=game-shows", icon: <Tv size={22} />, label: t("nav.gameShows"), count: GAMES.filter((g) => g.category === "game-shows").length },
    { href: "/casino?cat=table", icon: <Club size={22} />, label: t("nav.tableGames"), count: GAMES.filter((g) => g.category === "table").length },
    { href: "/casino?cat=originals", icon: <Dice5 size={22} />, label: t("nav.originals"), count: GAMES.filter((g) => g.category === "originals").length },
    { href: "/sports", icon: <Trophy size={22} />, label: t("nav.sports"), count: null },
  ];

  return (
    <section className="mb-10">
      <h2 className="mb-3.5 text-lg font-extrabold tracking-tight">{t("home.categories")}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cats.map((c) => (
          <Link key={c.href} href={c.href} className="surface lift group flex flex-col gap-3 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-em/10 text-em transition-transform duration-300 group-hover:scale-110">
              {c.icon}
            </span>
            <span>
              <span className="block text-[14px] font-extrabold text-ink">{c.label}</span>
              <span className="block text-[11.5px] font-semibold text-mute">
                {c.count !== null ? `${c.count} ${t("common.games")}` : "Live"}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function PromoBanners() {
  const { t } = useI18n();
  const banners = [
    {
      href: "/bonuses",
      img: "/images/bonus-welcome.webp",
      title: t("bonuses.cards.welcome.title"),
      text: t("bonuses.cards.welcome.desc"),
      cta: t("common.details"),
      icon: <Gift size={15} />,
    },
    {
      href: "/sports",
      img: "/images/sports-hero.webp",
      title: t("home.sportsTitle"),
      text: t("home.sportsText"),
      cta: t("home.sportsCta"),
      icon: <Trophy size={15} />,
    },
    {
      href: "/vip",
      img: "/images/vip.webp",
      title: t("vip.title"),
      text: t("vip.subtitle"),
      cta: t("common.details"),
      icon: <Gem size={15} />,
    },
  ];

  return (
    <section className="mb-10 grid gap-4 lg:grid-cols-3">
      {banners.map((b) => (
        <Link
          key={b.href}
          href={b.href}
          className="group relative block h-[190px] overflow-hidden rounded-2xl border border-line lift"
        >
          <Image
            src={b.img}
            alt={b.title}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-page/95 via-page/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-6">
            <h3 className="max-w-[240px] text-[17px] font-extrabold leading-tight tracking-tight">
              {b.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 max-w-[250px] text-[12px] leading-snug text-sub">
              {b.text}
            </p>
            <span className="mt-3.5 inline-flex w-fit items-center gap-1.5 rounded-lg bg-em px-3 py-1.5 text-[12px] font-extrabold text-[#04281b] transition-colors group-hover:bg-em-bright">
              {b.icon}
              {b.cta}
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}

function SportsTeaser() {
  const { t } = useI18n();
  const events = liveEvents().slice(0, 3);

  return (
    <section className="relative mb-10 overflow-hidden rounded-2xl border border-line">
      <Image src="/images/sports-hero.webp" alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-page/85" />
      <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-danger/40 bg-danger/10 px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-wide text-danger">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-danger" />
            {t("sports.live")}
          </span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {t("home.sportsTitle")}
          </h2>
          <p className="mt-3 max-w-[400px] text-[14px] leading-relaxed text-sub">
            {t("home.sportsText")}
          </p>
          <Link href="/sports" className="mt-5 inline-block">
            <Button>
              {t("home.sportsCta")}
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
        <div className="space-y-2.5">
          {events.map((e) => (
            <div key={e.id} className="rounded-xl border border-line bg-panel/90 p-3.5 backdrop-blur">
              <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-mute">
                <span>{e.league}</span>
                <span className="flex items-center gap-1.5 font-extrabold text-danger">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-danger" />
                  {e.liveClock}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-bold">{e.home}</p>
                  <p className="truncate text-[13.5px] font-bold">{e.away}</p>
                </div>
                {e.score && (
                  <div className="tnum text-right text-[13.5px] font-extrabold text-em">
                    <p>{e.score[0]}</p>
                    <p>{e.score[1]}</p>
                  </div>
                )}
                <div className="flex gap-1.5">
                  <OddsButton event={e} market="p1" compact />
                  {e.odds.x !== null && <OddsButton event={e} market="x" compact />}
                  <OddsButton event={e} market="p2" compact />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const { t, dict } = useI18n();
  const icons = [
    <Timer size={22} key="t" />,
    <Wallet size={22} key="w" />,
    <ShieldCheck size={22} key="s" />,
    <Landmark size={22} key="l" />,
  ];
  return (
    <section className="mb-10">
      <h2 className="mb-3.5 text-lg font-extrabold tracking-tight">{t("home.whyTitle")}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {dict.home.why.map((w, i) => (
          <div key={w.t} className="surface p-5">
            <span className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-xl bg-em/10 text-em">
              {icons[i]}
            </span>
            <p className="text-[14.5px] font-extrabold">{w.t}</p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-mute">{w.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProvidersStrip() {
  const { t } = useI18n();
  return (
    <section className="mb-10">
      <h2 className="mb-3.5 text-lg font-extrabold tracking-tight">{t("home.providersTitle")}</h2>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {PROVIDERS.map((p) => (
          <Link
            key={p}
            href="/providers"
            className="flex h-14 shrink-0 items-center rounded-xl border border-line bg-card px-6 text-[13.5px] font-extrabold tracking-tight text-sub transition-colors hover:border-line2 hover:text-ink"
          >
            {p}
          </Link>
        ))}
      </div>
    </section>
  );
}

function BottomCta() {
  const { t } = useI18n();
  const user = useAuth((s) => s.user);
  const { openAuth } = useUi();
  const mounted = useHasMounted();
  if (mounted && user) return null;

  return (
    <section className="bg-em-glow relative mb-4 overflow-hidden rounded-2xl border border-em/25 px-6 py-12 text-center">
      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{t("home.ctaTitle")}</h2>
      <p className="mx-auto mt-2.5 max-w-[380px] text-[14px] text-sub">{t("home.ctaText")}</p>
      <Button size="lg" className="mt-6" onClick={() => openAuth("register")}>
        {t("home.ctaBtn")}
        <ArrowRight size={17} />
      </Button>
    </section>
  );
}

export default function HomePage() {
  const { t } = useI18n();
  const top = GAMES.filter((g) => g.tags?.includes("top") || g.tags?.includes("hot")).slice(0, 12);
  const live = GAMES.filter((g) => g.category === "live" || g.category === "game-shows").slice(0, 10);
  const news = GAMES.filter((g) => g.tags?.includes("new"));
  const originals = GAMES.filter((g) => g.category === "originals");

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
      <Hero />
      <LiveWins />
      <CategoryCards />
      <GameRow title={t("home.topSlots")} icon={<Sparkles size={19} />} games={top} href="/casino?cat=slots" />
      <PromoBanners />
      <GameRow title={t("home.liveCasino")} icon={<Radio size={19} />} games={live} href="/casino?cat=live" />
      <SportsTeaser />
      <GameRow title={t("home.originalsRow")} icon={<Dice5 size={19} />} games={originals} href="/casino?cat=originals" />
      {news.length > 0 && (
        <GameRow title={t("home.newGames")} icon={<Gift size={19} />} games={news} href="/casino" />
      )}
      <WhyUs />
      <ProvidersStrip />
      <BottomCta />
    </div>
  );
}
