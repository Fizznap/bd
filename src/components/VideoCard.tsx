"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, Play } from "lucide-react";
import type { VideoMemory } from "@/types/media";

type Props = {
  video: VideoMemory;
  /** Padded display number, e.g. "04". */
  number: string;
  /** Row span depth in the gallery grid. */
  featured?: boolean;
  onOpen: (trigger: HTMLButtonElement) => void;
};

function Poster({
  video,
  className = "",
}: {
  video: VideoMemory;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!video.poster || failed) {
    // Attractive placeholder when the real media file is not present yet.
    return (
      <span
        className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-blush/70 ${className}`}
      >
        <Heart size={18} color="#7B354D" fill="#EFA8BC" strokeWidth={1} />
        <span className="font-hand text-lg text-burgundy/80">memory on the way</span>
      </span>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={video.poster}
      alt=""
      loading="lazy"
      decoding="async"
      width={video.width}
      height={video.height}
      onError={() => setFailed(true)}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}

function PlayRing() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-warm-white/60 bg-warm-white/15 opacity-80 backdrop-blur-sm transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100"
    >
      <Play size={15} className="translate-x-[1px] text-warm-white" fill="currentColor" />
    </span>
  );
}


/**
 * One memory card in the video gallery. Three scrapbook variants:
 * a white polaroid, a film-strip clip, and a clean cinematic tile.
 */
export default function VideoCard({ video, number, featured, onOpen }: Props) {
  const reduce = useReducedMotion();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onOpen(event.currentTarget);
  };

  return (
    <motion.div
      layout
      className={`group ${featured ? "row-span-3" : "row-span-2"}`}
      initial={reduce ? false : { opacity: 0, scale: 0.92, y: 14 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduce ? undefined : { rotate: 0, y: -6 }}
      whileTap={{ scale: 0.97 }}
      style={{ rotate: `${video.tilt ?? 0}deg` }}
    >
      {video.variant === "film" ? (
        <button
          type="button"
          onClick={handleClick}
          aria-label={`Play moment ${number}: ${video.caption}`}
          className="flex h-full w-full flex-col text-left outline-offset-4"
        >
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[9px] bg-[#241017] p-[5px] shadow-paper transition-shadow duration-300 group-hover:shadow-lift">
            <span aria-hidden="true" className="film-perf-h h-3.5 rounded-t-[5px]" />
            <span className="relative min-h-0 flex-1 overflow-hidden rounded-[3px] bg-blush/40">
              <Poster video={video} />
              <PlayRing />
            </span>
            <span aria-hidden="true" className="film-perf-h h-3.5 rounded-b-[5px]" />
            <span className="pointer-events-none absolute right-2 top-5 z-10 rounded-full bg-[#241017]/70 px-2 py-[2px] text-[11px] font-medium tracking-widest text-peach">
              {number}
            </span>
          </div>
          <span className="font-hand mt-1.5 line-clamp-2 px-0.5 text-center text-lg leading-snug text-ink">
            {video.caption}
          </span>
        </button>
      ) : video.variant === "cinematic" ? (
        <button
          type="button"
          onClick={handleClick}
          aria-label={`Play moment ${number}: ${video.caption}`}
          className="relative flex h-full w-full flex-col overflow-hidden rounded-[16px] bg-[#241017] text-left outline-offset-4 shadow-paper transition-shadow duration-300 group-hover:shadow-lift"
        >
          <span className="relative min-h-0 flex-1 overflow-hidden">
            <Poster video={video} className="transition-transform duration-500 md:group-hover:scale-105" />
            <PlayRing />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#2a1218]/85 via-[#2a1218]/25 to-transparent"
            />
            <span className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-3.5">
              <span className="line-clamp-2 max-w-[80%] font-hand pr-1 text-lg leading-snug text-warm-white">
                {video.caption}
              </span>
              <span className="shrink-0 rounded-full bg-warm-white/12 px-2 py-[2px] text-[10px] font-medium tracking-widest text-warm-white/85 backdrop-blur">
                {video.duration}
              </span>
            </span>
            <span className="pointer-events-none absolute left-2.5 top-2.5 z-10 rounded-full bg-warm-white/15 px-2 py-[2px] text-[11px] font-medium tracking-widest text-warm-white backdrop-blur">
              {number}
            </span>
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          aria-label={`Play moment ${number}: ${video.caption}`}
          className="polaroid flex h-full w-full flex-col text-left outline-offset-4"
        >
          <span className="relative min-h-0 flex-1 overflow-hidden rounded-[3px] bg-blush/40 shadow-inner">
            <Poster video={video} />
            <PlayRing />
            <span
              aria-hidden="true"
              className={`absolute z-10 ${
                featured ? "bottom-2 right-2" : "bottom-1.5 right-1.5"
              } rounded-full bg-warm-white/85 px-1.5 py-[2px] text-[10px] font-medium tracking-wider text-burgundy/75`}
            >
              {number}
            </span>
          </span>
          <span className="font-hand mt-2 line-clamp-2 px-0.5 pb-0.5 text-center text-lg leading-snug text-ink">
            {video.caption}
          </span>
        </button>
      )}
    </motion.div>
  );
}
