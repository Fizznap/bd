"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { birthdayConfig as config } from "@/data/birthday-config";

/**
 * SECTION 3 — a scrapbook introduction note on textured paper,
 * sealed with a little heart stamp and washi tape.
 */
export default function IntroNote() {
  const reduce = useReducedMotion();

  return (
    <section
      id="note"
      aria-labelledby="note-heading"
      className="relative px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-xl">
        <motion.h2
          id="note-heading"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-center text-3xl italic text-ink sm:text-4xl"
        >
          {config.noteHeading}
        </motion.h2>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30, rotate: reduce ? 0 : -2 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="paper-card paper-texture relative mt-12 p-8 pb-7 sm:p-10"
        >
          <div aria-hidden="true" className="washi washi-rose -top-3 left-8 -rotate-6" />
          <div aria-hidden="true" className="washi washi-peach -top-3 right-10 rotate-3" />

          {/* heart stamp */}
          <span
            aria-hidden="true"
            className="absolute right-6 top-6 flex h-14 w-14 rotate-12 items-center justify-center rounded-full border-2 border-dashed border-rose/60 sm:right-8 sm:top-8"
          >
            <Heart size={20} color="#7B354D" fill="#EFA8BC" strokeWidth={1} />
          </span>

          <p className="font-hand relative pr-16 text-[1.4rem] leading-[1.65] text-ink sm:pr-20 sm:text-[1.55rem]">
            {config.noteText}
          </p>

          <p className="font-hand mt-6 -rotate-1 text-right text-2xl text-burgundy">
            {config.noteSignature}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
