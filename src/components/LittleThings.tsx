"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Flower2, Heart, Music, Sparkles, Star } from "lucide-react";
import { littleThings, type LittleThing } from "@/data/little-things";

const ICONS = {
  sparkles: Sparkles,
  flower: Flower2,
  star: Star,
  heart: Heart,
  music: Music,
} as const;

const CARD_TINTS = [
  "bg-warm-white",
  "bg-peach/70",
  "bg-warm-white",
  "bg-blush/60",
  "bg-warm-white",
];

function ThingCard({ thing, tint, index }: { thing: LittleThing; tint: string; index: number }) {
  const reduce = useReducedMotion();
  const Icon = ICONS[thing.icon];

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="relative list-none"
    >
      <div
        className={`paper-card group relative flex items-start gap-4 p-5 pr-6 transition-shadow duration-300 hover:shadow-lift ${tint} ${
          index % 2 === 1 ? "md:translate-y-7" : ""
        }`}
        style={{ rotate: `${thing.tilt}deg` }}
      >
        <span
          aria-hidden="true"
          className="absolute -right-2 -top-2 flex h-7 w-7 rotate-12 items-center justify-center rounded-full bg-warm-white shadow-paper"
        >
          <Heart size={12} color="#7B354D" fill="#EFA8BC" strokeWidth={1} />
        </span>
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 -rotate-3 items-center justify-center rounded-full bg-warm-white/90 shadow-paper transition-transform duration-300 group-hover:rotate-3"
        >
          <Icon size={19} color="#7B354D" strokeWidth={1.8} />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-medium leading-snug text-ink sm:text-base">
            {thing.text}
          </p>
          <p className="font-hand mt-1.5 text-lg leading-tight text-rose underline decoration-rose/40 decoration-1 underline-offset-4">
            {thing.note}
          </p>
        </div>
      </div>
    </motion.li>
  );
}

/**
 * SECTION 7 — a compact board of small, sincere appreciations.
 */
export default function LittleThings() {
  const reduce = useReducedMotion();

  return (
    <section
      id="little-things"
      aria-labelledby="things-heading"
      className="relative px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-3xl">
        <motion.h2
          id="things-heading"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-center text-3xl font-semibold leading-[1.15] text-ink sm:text-4xl md:text-5xl"
        >
          Little Things That Deserve Appreciation ♡
        </motion.h2>

        <ul className="mt-12 grid gap-7 md:grid-cols-2 md:gap-x-10 md:gap-y-8">
          {littleThings.map((thing, i) => (
            <ThingCard
              key={thing.id}
              thing={thing}
              tint={CARD_TINTS[i % CARD_TINTS.length]}
              index={i}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
