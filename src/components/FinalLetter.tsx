"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart, RotateCcw } from "lucide-react";
import { seededRandom } from "@/lib/media-utils";
import { birthdayConfig as config } from "@/data/birthday-config";

type Props = {
  /** Replays the whole experience from the opening screen. */
  onReplay: () => void;
};

/**
 * SECTION 8 — the final letter, on warm paper with drifting
 * petals, plus a gentle one-tap replay.
 */
export default function FinalLetter({ onReplay }: Props) {
  const reduce = useReducedMotion();

  const petals = Array.from({ length: 7 }, (_, i) => {
    const rand = seededRandom(31 + i * 13);
    return {
      left: 6 + rand() * 88,
      duration: 8 + rand() * 7,
      delay: -rand() * 10,
      size: 10 + rand() * 14,
      drift: (rand() - 0.5) * 30,
      opacity: 0.25 + rand() * 0.3,
    };
  });

  const paragraphs = config.finalLetterParagraphs;

  return (
    <section
      id="letter"
      aria-labelledby="letter-heading"
      className="relative overflow-hidden px-6 py-24 sm:py-28"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(252,232,220,0) 0%, rgba(252,232,220,0.65) 25%, rgba(248,221,229,0.55) 100%)",
      }}
    >
      {/* drifting petals */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {petals.map((p, i) => (
          <span
            key={i}
            className="anim-drift absolute top-0"
            style={{
              left: `${p.left}%`,
              ["--deco-duration" as string]: `${p.duration}s`,
              ["--drift-x" as string]: `${p.drift}px`,
              ["--deco-opacity" as string]: p.opacity,
              animationDelay: `${p.delay}s`,
            }}
          >
            <Heart size={p.size} color="#EFA8BC" fill="#EFA8BC" strokeWidth={0} />
          </span>
        ))}
      </div>

      <div className="relative mx-auto max-w-xl">
        <motion.h2
          id="letter-heading"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-center text-3xl italic text-ink sm:text-4xl md:text-5xl"
        >
          {config.finalLetterHeading}
        </motion.h2>

        <motion.article
          initial={reduce ? false : { opacity: 0, y: 30, rotate: -1.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          aria-label="A letter for you"
          className="paper-card paper-texture relative mt-12 p-8 sm:p-10"
        >
          <div aria-hidden="true" className="washi washi-rose -top-3.5 left-10 -rotate-3" />
          <div aria-hidden="true" className="washi washi-peach -top-3.5 right-12 rotate-2" />

          {/* heart stamp */}
          <span
            aria-hidden="true"
            className="absolute right-6 top-6 flex h-14 w-14 rotate-12 items-center justify-center rounded-full border-2 border-dashed border-rose/60 sm:right-8 sm:top-8"
          >
            <Heart size={20} color="#7B354D" fill="#EFA8BC" strokeWidth={1} />
          </span>

          {paragraphs.map((paragraph, i) =>
            i === 0 ? (
              <p
                key={i}
                className="font-display pr-14 text-2xl italic text-burgundy sm:pr-16"
              >
                {paragraph}
              </p>
            ) : (
              <p
                key={i}
                className={`font-hand mt-6 text-[1.45rem] leading-[1.6] text-ink ${
                  i === paragraphs.length - 1 ? "text-burgundy" : ""
                }`}
              >
                {paragraph}
              </p>
            ),
          )}

          <p className="mt-10 text-right">
            <span className="font-hand text-2xl leading-snug text-burgundy">
              With hope, {config.finalLetterSignature} ♡
              {config.showSenderName && config.senderName ? (
                <>
                  <br />
                  {config.senderName}
                </>
              ) : null}
            </span>
          </p>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={onReplay}
              className="inline-flex items-center gap-2 rounded-full border border-burgundy/40 bg-warm-white/85 px-6 py-3 text-sm font-semibold text-burgundy shadow-paper transition-all duration-300 hover:-translate-y-0.5 hover:border-burgundy hover:bg-blush/50 active:translate-y-px active:scale-[0.98]"
            >
              <RotateCcw size={15} strokeWidth={2.2} aria-hidden="true" />
              {config.replayButtonText}
            </button>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
