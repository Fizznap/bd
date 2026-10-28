"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { seededRandom } from "@/lib/media-utils";

type Particle = {
  color: string;
  left: number;
  width: number;
  height: number;
  round: boolean;
  drift: number;
  rot1: number;
  rot2: number;
  duration: number;
  delay: number;
};

const CONFETTI_COLORS = ["#EFA8BC", "#F8DDE5", "#7B354D", "#FCE8DC", "#FFFFFF"];

/**
 * A short, lightweight confetti burst. Plays once when `burst`
 * becomes true, then fades away on its own. Skipped entirely for
 * visitors who prefer reduced motion.
 */
export default function Confetti({ burst }: { burst: boolean }) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!burst || reduce) return;
    setShow(true);
    const timer = setTimeout(() => setShow(false), 4400);
    return () => clearTimeout(timer);
  }, [burst, reduce]);

  const particles = useMemo<Particle[]>(() => {
    const rand = seededRandom(7);
    return Array.from({ length: 80 }, (): Particle => ({
      color: CONFETTI_COLORS[Math.floor(rand() * CONFETTI_COLORS.length)],
      left: 8 + rand() * 84,
      width: 6 + rand() * 5,
      height: rand() > 0.35 ? 9 + rand() * 5 : 6 + rand() * 5,
      round: false,
      drift: (rand() - 0.5) * 180,
      rot1: (rand() - 0.5) * 120,
      rot2: (rand() - 0.5) * 640,
      duration: 2.4 + rand() * 1.4,
      delay: rand() * 0.5,
    }));
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute -top-6 left-0"
          style={{
            backgroundColor: p.color,
            width: p.width,
            height: p.height,
            borderRadius: 2,
            left: `${p.left}%`,
          }}
          initial={{ x: 0, y: 0, rotate: p.rot1, opacity: 0 }}
          animate={{ x: p.drift, y: "108vh", rotate: p.rot2, opacity: [0, 1, 1, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            opacity: { times: [0, 0.1, 0.7, 1] },
            ease: [0.3, 0.2, 0.6, 1],
          }}
        />
      ))}
    </div>
  );
}
