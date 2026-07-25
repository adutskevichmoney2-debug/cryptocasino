"use client";

import Link from "next/link";
import { Dices } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/misc";
import { useI18n } from "@/lib/i18n/provider";

export default function BetsPage() {
  const { t } = useI18n();

  // TODO(backend): история ставок приходит из API (казино + спорт).
  // До интеграции список честно пуст — заглушек с фейковыми ставками нет.
  return (
    <div className="surface">
      <EmptyState
        icon={<Dices size={26} />}
        title={t("profile.noBets")}
        hint={t("profile.noBetsHint")}
        action={
          <Link href="/casino">
            <Button size="sm">{t("nav.casino")}</Button>
          </Link>
        }
      />
    </div>
  );
}
