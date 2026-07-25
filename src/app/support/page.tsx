"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Headset, Mail, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AccordionItem } from "@/components/ui/misc";
import { useI18n } from "@/lib/i18n/provider";
import { useUi } from "@/lib/stores/ui";
import { FAQ } from "@/lib/data/faq";
import { EMAIL_RE, cn } from "@/lib/utils";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function SupportPage() {
  const { t, locale } = useI18n();
  const { setChat, toast } = useUi();
  const [cat, setCat] = useState(FAQ[0].id);
  const lang: "ru" | "en" = locale === "ru" ? "ru" : "en";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ mode: "onTouched" });

  // TODO(backend): отправка тикета в сервис поддержки / таблицу tickets
  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 600));
    toast("success", t("supportPage.sent"), t("supportPage.sentHint"));
    reset();
  });

  const current = FAQ.find((c) => c.id === cat)!;

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-em/30 bg-em/10 px-3.5 py-1.5 text-[12px] font-extrabold text-em">
          <Headset size={13} />
          {t("supportPage.online247")}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t("supportPage.title")}
        </h1>
        <p className="mx-auto mt-2.5 max-w-[420px] text-[14px] text-sub">
          {t("supportPage.subtitle")}
        </p>
        <Button className="mt-5" onClick={() => setChat(true)}>
          <MessageCircle size={16} />
          {t("supportPage.chat")}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* FAQ */}
        <div>
          <h2 className="mb-4 text-lg font-extrabold tracking-tight">
            {t("supportPage.faqTitle")}
          </h2>
          <div className="no-scrollbar -mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
            {FAQ.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-[12.5px] font-bold transition-colors",
                  cat === c.id
                    ? "bg-em text-[#04281b]"
                    : "border border-line bg-card text-sub hover:border-line2 hover:text-ink",
                )}
              >
                {t(`supportPage.cats.${c.id}`)}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {current.items.map((item) => (
              <AccordionItem key={item.q.en} title={item.q[lang]}>
                {item.a[lang]}
              </AccordionItem>
            ))}
          </div>
        </div>

        {/* contact form */}
        <div>
          <h2 className="mb-4 text-lg font-extrabold tracking-tight">
            {t("supportPage.contact")}
          </h2>
          <form onSubmit={onSubmit} className="surface space-y-3.5 p-5" noValidate>
            <Input
              label={t("supportPage.name")}
              error={errors.name?.message}
              {...register("name", { required: " " })}
            />
            <Input
              label={t("auth.email")}
              type="email"
              left={<Mail size={16} />}
              error={errors.email?.message}
              {...register("email", {
                required: t("auth.err.emailInvalid"),
                pattern: { value: EMAIL_RE, message: t("auth.err.emailInvalid") },
              })}
            />
            <Input
              label={t("supportPage.subject")}
              error={errors.subject?.message}
              {...register("subject", { required: " " })}
            />
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-sub">
                {t("supportPage.message")}
              </label>
              <textarea
                rows={5}
                className={cn(
                  "w-full rounded-[10px] border bg-field px-3.5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-mute",
                  errors.message ? "border-danger/70" : "border-line focus:border-em/70",
                )}
                {...register("message", { required: " " })}
              />
            </div>
            <Button type="submit" fullWidth loading={isSubmitting}>
              <Send size={15} />
              {t("supportPage.send")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
