"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, SendHorizontal, X } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { useI18n } from "@/lib/i18n/provider";
import { useUi } from "@/lib/stores/ui";
import { cn, uid } from "@/lib/utils";

interface ChatMsg {
  id: string;
  who: "user" | "agent";
  text: string;
}

/**
 * Виджет чата поддержки (UI работает, история — в состоянии страницы).
 * ============================================================
 * SUPPORT_CHAT_EMBED — точка интеграции реального сервиса поддержки
 * (Intercom / Chatwoot / Crisp / собственный на Supabase Realtime).
 * TODO(backend): заменить локальный автоответ на реальный канал.
 * ============================================================
 */
export function ChatWidget() {
  const { t } = useI18n();
  const { chatOpen, setChat } = useUi();
  // Приветствие рендерится как первый пузырь (не хранится в состоянии),
  // поэтому оно всегда на актуальном языке и не требует эффектов.
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [messages, chatOpen]);

  const send = () => {
    const v = text.trim();
    if (!v) return;
    setMessages((m) => [...m, { id: uid(), who: "user", text: v }]);
    setText("");
    setTimeout(() => {
      setMessages((m) => [...m, { id: uid(), who: "agent", text: t("supportPage.chatReply") }]);
    }, 900);
  };

  return (
    <>
      {/* floating button */}
      <AnimatePresence>
        {!chatOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            onClick={() => setChat(true)}
            aria-label={t("supportPage.chat")}
            className="fixed bottom-24 right-4 z-[70] flex h-13 w-13 items-center justify-center rounded-full bg-em p-3.5 text-[#04281b] shadow-glow transition-transform hover:scale-105 lg:bottom-6 lg:right-6"
          >
            <MessageCircle size={22} strokeWidth={2.4} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed bottom-20 right-3 z-[70] flex h-[480px] w-[min(94vw,360px)] flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-pop lg:bottom-6 lg:right-6"
          >
            <div className="flex items-center gap-3 border-b border-line bg-card px-4 py-3">
              <div className="relative">
                <LogoMark size={32} />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-em" />
              </div>
              <div className="flex-1">
                <p className="text-[13.5px] font-extrabold leading-tight">{t("supportPage.chat")}</p>
                <p className="text-[11px] font-semibold text-em">{t("supportPage.online247")}</p>
              </div>
              <button
                onClick={() => setChat(false)}
                className="rounded-lg p-1.5 text-mute transition-colors hover:bg-raise hover:text-ink"
              >
                <X size={17} />
              </button>
            </div>

            <div ref={listRef} className="flex-1 space-y-2.5 overflow-y-auto p-4">
              <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-raise px-3.5 py-2.5 text-[13px] leading-snug text-ink">
                {t("supportPage.chatGreeting")}
              </div>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug",
                    m.who === "user"
                      ? "ml-auto rounded-br-md bg-em text-[#04281b] font-semibold"
                      : "rounded-bl-md bg-raise text-ink",
                  )}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="border-t border-line p-3">
              <div className="flex items-center gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder={t("supportPage.chatPlaceholder")}
                  className="h-10 flex-1 rounded-[10px] border border-line bg-field px-3.5 text-[13px] text-ink outline-none placeholder:text-mute focus:border-em/70"
                />
                <button
                  onClick={send}
                  aria-label={t("supportPage.send")}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-em text-[#04281b] transition-colors hover:bg-em-bright disabled:opacity-50"
                  disabled={!text.trim()}
                >
                  <SendHorizontal size={17} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
