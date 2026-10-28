"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import { useLightboxKeys, useScrollLock } from "@/lib/lightbox-utils";
import type { VideoMemory } from "@/types/media";

type Props = {
  /** Videos currently shown in the gallery (respects active filter). */
  videos: VideoMemory[];
  /** Index into `videos` of the open video, or null when closed. */
  index: number | null;
  /** Numbers matching the gallery labels, e.g. "04". */
  numbers: string[];
  onClose: () => void;
  onNavigate: (direction: -1 | 1) => void;
};

/**
 * SECTION 4 support — polished lightbox for playing a single video
 * with native controls. Plays only one video at a time, stops
 * playback on close, locks background scroll, supports Escape,
 * backdrop close and arrow-key navigation.
 */
export default function VideoLightbox({
  videos,
  index,
  numbers,
  onClose,
  onNavigate,
}: Props) {
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [errored, setErrored] = useState(false);

  const open = index !== null && index >= 0 && index < videos.length;
  useScrollLock(open);

  useLightboxKeys(open, onClose, dialogRef, {
    onArrow: open ? onNavigate : undefined,
  });

  // Reset the error flag whenever another video opens.
  useEffect(() => {
    setErrored(false);
  }, [index]);

  return (
    <AnimatePresence>
      {open && videos[index!] ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#2a1218]/75 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Playing moment ${numbers[index!]}: ${videos[index!].caption}`}
            tabIndex={-1}
            className="relative flex max-h-[88svh] w-full max-w-[min(93vw,520px)] flex-col overflow-hidden rounded-[20px] bg-[#241017] shadow-lift outline-none"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            {errored ? (
              <div className="flex min-h-[52svh] flex-col items-center justify-center gap-3 px-8 text-center">
                <Heart size={26} color="#EFA8BC" fill="#EFA8BC" strokeWidth={1} />
                <p className="font-hand text-2xl text-warm-white">
                  This memory is still on its way ♡
                </p>
                <p className="text-sm text-warm-white/60">
                  The clip is not available right now, but the rest of the scrapbook
                  is yours to explore.
                </p>
              </div>
            ) : (
              <div className="flex min-h-0 items-center justify-center">
                <video
                  key={videos[index!].src}
                  className="max-h-[72svh] max-w-full"
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  poster={videos[index!].poster}
                  onError={() => setErrored(true)}
                >
                  <source src={videos[index!].src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 border-t border-warm-white/10 px-3 py-3 sm:px-4">
              <button
                type="button"
                onClick={() => onNavigate(-1)}
                aria-label="Previous moment"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-warm-white/20 text-warm-white/85 transition-colors hover:border-warm-white/45 hover:text-warm-white"
              >
                <ChevronLeft size={18} strokeWidth={2} />
              </button>

              <div className="min-w-0 flex-1 text-center">
                <p className="font-hand truncate text-lg leading-snug text-peach sm:text-xl">
                  {videos[index!].caption}
                </p>
                <p className="mt-0.5 text-[11px] tracking-widest text-warm-white/50">
                  {numbers[index!]} of {numbers[numbers.length - 1]}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(1)}
                aria-label="Next moment"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-warm-white/20 text-warm-white/85 transition-colors hover:border-warm-white/45 hover:text-warm-white"
              >
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            </div>

            <button
              type="button"
              data-autofocus
              onClick={onClose}
              aria-label="Close video"
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-warm-white/12 text-warm-white backdrop-blur transition-colors hover:bg-warm-white/25"
            >
              <X size={18} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
