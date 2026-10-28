"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Heart } from "lucide-react";
import FloatingDecorations from "@/components/FloatingDecorations";
import { birthdayConfig as config } from "@/data/birthday-config";

type Props = {
  onOpen: () => void;
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * SECTION 1 — the opening screen. Reads like the flap of a
 * personal letter: name, a whisper of what is inside, and a
 * single button to unwrap everything.
 */
export default function IntroScreen({ onOpen }: Props) {
  const reduce = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-cream px-6"
      initial={false}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.05, filter: "blur(6px)" }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
      style={{
        backgroundImage:
          "radial-gradient(900px 480px at 50% -8%, rgb(248 221 229 / 0.85), transparent 65%), radial-gradient(600px 420px at 92% 88%, rgb(250 214 190 / 0.6), transparent 60%)",
      }}
    >
      <FloatingDecorations count={11} />

      {/* tiny polaroid keepsakes */}
      <motion.div
        aria-hidden="true"
        className="polaroid absolute bottom-[14%] left-[8%] hidden w-20 -rotate-6 sm:block"
        initial={{ opacity: 0, y: 20, rotate: -12 }}
        animate={{ opacity: 1, y: 0, rotate: -6 }}
        transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative h-16 w-full overflow-hidden rounded-[3px] bg-blush">
          <Heart
            className="anim-float absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            size={26}
            color="#7B354D"
            fill="#EFA8BC"
            strokeWidth={1}
          />
        </div>
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="polaroid absolute right-[10%] top-[18%] hidden w-16 rotate-6 sm:block"
        initial={{ opacity: 0, y: -20, rotate: 12 }}
        animate={{ opacity: 1, y: 0, rotate: 6 }}
        transition={{ duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative h-14 w-full overflow-hidden rounded-[3px] bg-peach">
          <span className="font-hand absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-burgundy/70">
            ♡
          </span>
        </div>
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto max-w-xl text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* wax-seal style badge */}
        <motion.div variants={item} className="mb-6 flex justify-center">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 rotate-6 items-center justify-center rounded-full border border-burgundy/15 bg-warm-white shadow-paper"
          >
            <Heart size={22} color="#7B354D" fill="#EFA8BC" strokeWidth={1} />
          </span>
        </motion.div>

        <motion.p variants={item} className="font-hand text-xl text-burgundy/70 sm:text-2xl">
          {config.introPreTitle}
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-4 font-display text-4xl italic leading-[1.1] text-ink sm:text-5xl md:text-6xl"
        >
          {config.introTitle}
        </motion.h1>

        <motion.p
          variants={item}
          className="font-hand mt-5 text-5xl font-semibold leading-[1.1] text-burgundy sm:text-6xl"
        >
          for {config.recipientName} ♡
        </motion.p>

        <motion.p variants={item} className="mt-7 text-base leading-relaxed text-ink/80">
          {config.introSubtitle}
        </motion.p>

        <motion.div variants={item} className="mt-9">
          <button
            ref={buttonRef}
            type="button"
            onClick={onOpen}
            className="group inline-flex items-center gap-2 rounded-full bg-burgundy px-8 py-4 text-sm font-semibold tracking-wide text-warm-white shadow-lift transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-px active:scale-[0.98] sm:text-base"
          >
            {config.openButtonText}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </button>
        </motion.div>

        <motion.p variants={item} className="mt-8">
          <span className="font-hand inline-block -rotate-1 text-lg text-rose/90 sm:text-xl">
            {config.introNote}
          </span>
        </motion.p>
      </motion.div>

      {/* washi tapes framing the letter */}
      <div aria-hidden="true" className="washi washi-rose -left-8 top-16 -rotate-45" />
      <div aria-hidden="true" className="washi washi-peach -right-10 bottom-14 -rotate-45" />
    </motion.div>
  );
}
