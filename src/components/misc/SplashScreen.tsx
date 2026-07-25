"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "@/components/brand/Logo";

const WORD = ["Crypto", "Casino"] as const;

/**
 * Быстрый премиальный сплеш при загрузке сайта (как у крупных проектов):
 * 3D-переворот фирменной фишки + появление названия. ~1.4 секунды.
 * Показывается только при полной загрузке страницы (клиентская навигация
 * внутри сайта его не перезапускает).
 */
export function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1450);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-page"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          {/* мягкое изумрудное свечение позади */}
          <motion.div
            className="absolute h-[340px] w-[340px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(23,197,136,0.20) 0%, rgba(23,197,136,0.05) 45%, transparent 70%)",
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.15, 1], opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* 3D-переворот фишки */}
          <div style={{ perspective: 900 }}>
            <motion.div
              initial={{ rotateY: -540, scale: 0.4, opacity: 0 }}
              animate={{ rotateY: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: "preserve-3d" }}
              className="drop-shadow-[0_10px_40px_rgba(23,197,136,0.35)]"
            >
              <LogoMark size={92} />
            </motion.div>
          </div>

          {/* название с посимвольным появлением */}
          <div className="mt-5 flex text-[26px] font-extrabold tracking-[-0.03em]">
            {WORD.map((part, pi) =>
              part.split("").map((ch, i) => (
                <motion.span
                  key={`${pi}-${i}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.38 + (pi * part.length + i) * 0.028,
                    duration: 0.34,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={pi === 1 ? "text-em" : "text-ink"}
                >
                  {ch}
                </motion.span>
              )),
            )}
          </div>

          {/* тонкий прогресс */}
          <div className="mt-7 h-[3px] w-[148px] overflow-hidden rounded-full bg-raise">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-em-dim via-em to-em-bright"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.15, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
