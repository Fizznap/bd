"use client";

import { useMemo } from "react";
import { Heart, Sparkles } from "lucide-react";
import { seededRandom } from "@/lib/media-utils";

type Props = {
  /** How many decorations to sprinkle. */
  count?: number;
  /** Extra positioning classes on the wrapper. */
  className?: string;
  hearts?: boolean;
  stars?: boolean;
};

type Deco = {
  kind: "heart" | "star";
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
  color: string;
};

const PALETTE = ["#EFA8BC", "#7B354D", "#FCE8DC", "#F8DDE5"];

/**
 * Scattered, gently floating hearts and twinkling stars.
 * Positions are generated with a seeded PRNG so server and client
 * markup match exactly (no hydration drift). Purely decorative.
 */
export default function FloatingDecorations({
  count = 9,
  className = "",
  hearts = true,
  stars = true,
}: Props) {
  const decos = useMemo<Deco[]>(() => {
    const rand = seededRandom(97);
    return Array.from({ length: count }, (_, i): Deco => {
      const starOnly = !hearts;
      const heartOnly = !stars;
      const kind: Deco["kind"] = heartOnly
        ? "heart"
        : starOnly
          ? "star"
          : i % 3 === 0
            ? "star"
            : "heart";
      return {
        kind,
        left: 3 + rand() * 92,
        top: 4 + rand() * 88,
        size: kind === "heart" ? 10 + rand() * 18 : 8 + rand() * 14,
        duration: 5.5 + rand() * 6,
        delay: -rand() * 9,
        drift: (rand() - 0.5) * 22,
        opacity: 0.22 + rand() * 0.4,
        color: PALETTE[Math.floor(rand() * PALETTE.length)],
      };
    });
  }, [count, hearts, stars]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {decos.map((d, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            opacity: d.opacity,
            ["--deco-duration" as string]: `${d.duration}s`,
            ["--deco-delay" as string]: `${d.delay}s`,
            ["--drift-x" as string]: `${d.drift}px`,
            ["--deco-opacity" as string]: d.opacity,
          }}
        >
          <span className={d.kind === "heart" ? "anim-float block" : "anim-twinkle block"}>
            {d.kind === "heart" ? (
              <Heart
                size={d.size}
                color={d.color}
                fill="currentColor"
                strokeWidth={0}
              />
            ) : (
              <Sparkles size={d.size} color={d.color} strokeWidth={1.5} />
            )}
          </span>
        </span>
      ))}
    </div>
  );
}
