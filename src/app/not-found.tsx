"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/provider";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center px-6 py-20 text-center">
      <div className="relative">
        <p className="text-[110px] font-extrabold leading-none tracking-tighter text-raise select-none sm:text-[150px]">
          404
        </p>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 float-soft">
          <LogoMark size={64} />
        </span>
      </div>
      <h1 className="mt-6 text-xl font-extrabold tracking-tight sm:text-2xl">
        {t("misc.notFound")}
      </h1>
      <p className="mt-2 max-w-[360px] text-[13.5px] leading-relaxed text-mute">
        {t("misc.notFoundText")}
      </p>
      <Link href="/" className="mt-6">
        <Button size="lg">
          <Home size={16} />
          {t("misc.backHome")}
        </Button>
      </Link>
    </div>
  );
}
