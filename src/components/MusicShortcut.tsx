"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Music } from "lucide-react";

type Props = {
  /** Hidden while the intro screen is up. */
  visible: boolean;
};

/**
 * Small persistent music shortcut: scrolls politely back to the
 * Spotify section while scrolling. No second audio player.
 */
export default function MusicShortcut({ visible }: Props) {
  const reduce = useReducedMotion();

  const jump = () => {
    document
      .getElementById("music")
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          onClick={jump}
          aria-label="Jump to the music"
          className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full border border-rose/50 bg-warm-white/90 px-4 py-2.5 text-burgundy shadow-paper backdrop-blur transition-colors duration-300 hover:border-burgundy/60 hover:bg-warm-white active:scale-[0.97]"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.9 }}
          transition={{ duration: 0.4, delay: visible ? 1.2 : 0, ease: [0.16, 1, 0.3, 1] }}
        >
          <Music size={17} strokeWidth={2} aria-hidden="true" />
          <span className="text-sm font-medium">Soundtrack</span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
