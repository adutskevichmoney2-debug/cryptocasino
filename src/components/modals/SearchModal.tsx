"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { GameCard } from "@/components/casino/GameCard";
import { EmptyState } from "@/components/ui/misc";
import { useI18n } from "@/lib/i18n/provider";
import { useUi } from "@/lib/stores/ui";
import { GAMES } from "@/lib/data/games";

export function SearchModal() {
  const { modal, closeModal } = useUi();
  const open = modal === "search";

  return (
    <Modal open={open} onClose={closeModal} size="lg" noPadding>
      {/* содержимое монтируется при каждом открытии → поле всегда чистое */}
      <SearchBody />
    </Modal>
  );
}

function SearchBody() {
  const { t } = useI18n();
  const closeModal = useUi((s) => s.closeModal);
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 2) return [];
    return GAMES.filter(
      (g) =>
        g.title.toLowerCase().includes(query) ||
        g.provider.toLowerCase().includes(query),
    ).slice(0, 12);
  }, [q]);

  return (
    <>
      <div className="border-b border-line p-4 pr-14">
        <div className="relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("common.searchGames")}
            className="h-11 w-full rounded-[10px] border border-line bg-field pl-10 pr-4 text-sm text-ink outline-none placeholder:text-mute focus:border-em/70"
          />
        </div>
      </div>
      <div className="max-h-[60dvh] overflow-y-auto p-4">
        {q.trim().length < 2 ? (
          <p className="py-10 text-center text-[13px] text-mute">{t("common.searchGames")}</p>
        ) : results.length === 0 ? (
          <EmptyState title={t("common.nothingFound")} hint={t("common.nothingFoundHint")} />
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {results.map((g) => (
              <GameCard key={g.slug} game={g} onNavigate={closeModal} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
