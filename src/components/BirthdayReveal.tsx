"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Cake, Flower2, Star } from "lucide-react";
import Confetti from "@/components/Confetti";
import FloatingDecorations from "@/components/FloatingDecorations";
import { birthdayConfig as config } from "@/data/birthday-config";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

type Props = {
  /** Becomes true when the opening screen is dismissed. */
  active: boolean;
};

/**
 * SECTION 2 — the warm birthday reveal. Its entrance and the one
 * soft confetti burst are fired (once) when the opening screen
 * is dismissed, so the two moments hand over to each other.
 */
export default function BirthdayReveal({ active }: Props) {
  const reduce = useReducedMotion();
  const [confettiBurst, setConfettiBurst] = useState(false);

  useEffect(() => {
    if (!active || reduce) return;
    const timer = setTimeout(() => setConfettiBurst(true), 650);
    return () => clearTimeout(timer);
  }, [active, reduce]);

  return (
    <section
      id="birthday"
      className="relative flex min-h-[94svh] items-center justify-center overflow-hidden px-6 py-20 sm:py-24"
    >
      <FloatingDecorations count={8} />

      {config.animations.confetti ? <Confetti burst={confettiBurst} /> : null}

      <motion.div
        className="relative z-10 mx-auto max-w-2xl text-center"
        variants={container}
        initial="hidden"
        animate={active ? "show" : "hidden"}
      >
        <motion.div variants={item} className="mb-8 flex justify-center gap-3 md:gap-4">
          <span
            aria-hidden="true"
            className="anim-float flex h-10 w-10 rotate-6 items-center justify-center rounded-full bg-warm-white shadow-paper"
          >
            <Cake size={18} color="#7B354D" strokeWidth={1.8} />
          </span>
          <span
            aria-hidden="true"
            className="anim-float flex h-10 w-10 items-center justify-center rounded-full bg-warm-white shadow-paper"
            style={{ animationDelay: "-1.8s" }}
          >
            <Flower2 size={18} color="#7B354D" strokeWidth={1.8} />
          </span>
          <span
            aria-hidden="true"
            className="anim-float flex h-10 w-10 -rotate-6 items-center justify-center rounded-full bg-warm-white shadow-paper"
            style={{ animationDelay: "-3.4s" }}
          >
            <Star size={18} color="#7B354D" fill="#FCE8DC" strokeWidth={1.8} />
          </span>
        </motion.div>

        <motion.h2
          variants={item}
          className="font-display text-4xl font-semibold leading-[1.12] text-ink sm:text-5xl md:text-6xl"
        >
          {config.birthdayTitle}
        </motion.h2>

        <motion.p
          variants={item}
          className="font-hand mt-3 text-6xl font-semibold leading-[1.05] text-burgundy sm:text-7xl md:text-8xl"
        >
          {config.birthdayName}
        </motion.p>

        <motion.p
          variants={item}
          className="mx-auto mt-8 max-w-md text-base leading-relaxed text-ink/80 sm:text-lg"
        >
          {config.birthdaySubtitle}
        </motion.p>

        <motion.p variants={item} className="mt-6">
          <span className="font-hand inline-block -rotate-1 text-2xl text-rose sm:text-3xl">
            {config.birthdayTagline}
          </span>
        </motion.p>
      </motion.div>
    </section>
  );
}
