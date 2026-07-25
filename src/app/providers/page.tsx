"use client";

import Link from "next/link";
import { Layers } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { GAMES, PROVIDERS } from "@/lib/data/games";

export default function ProvidersPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {t("nav.providers")}
        </h1>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {PROVIDERS.map((p) => {
          const count = GAMES.filter((g) => g.provider === p).length;
          return (
            <Link key={p} href="/casino" className="surface lift group flex items-center gap-3.5 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-em/10 text-em transition-transform duration-300 group-hover:scale-110">
                <Layers size={20} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[14.5px] font-extrabold tracking-tight">{p}</span>
                <span className="block text-[12px] font-semibold text-mute">
                  {count} {t("common.games")}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
      {/* TODO(backend): список провайдеров и количество игр — из каталога агрегатора */}
    </div>
  );
}
