"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLightboxKeys, useScrollLock } from "@/lib/lightbox-utils";
import type { PhotoMemory } from "@/types/media";

type Props = {
  photos: PhotoMemory[];
  /** Index into `photos` of the open photo, or null when closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (direction: -1 | 1) => void;
};

/**
 * SECTION 5 support — a light little lightbox for the photo album.
 * Escape, backdrop click and arrows behave like the video lightbox.
 */
export default function PhotoLightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: Props) {
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  const open = index !== null && index >= 0 && index < photos.length;
  useScrollLock(open);

  useLightboxKeys(open, onClose, dialogRef, {
    onArrow: open ? onNavigate : undefined,
  });

  useEffect(() => {
    setFailed(false);
  }, [index]);

  return (
    <AnimatePresence>
      {open && photos[index!] ? (
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
            aria-label={`Viewing ${photos[index!].title}: ${photos[index!].caption}`}
            tabIndex={-1}
            className="relative flex w-full max-w-[min(92vw,720px)] flex-col overflow-hidden rounded-[20px] bg-warm-white p-3 shadow-lift outline-none sm:p-4"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex max-h-[76svh] max-w-3xl">
              {failed ? (
                <div className="flex min-h-[38svh] w-full flex-col items-center justify-center gap-2 rounded-lg bg-blush/60 px-8 text-center">
                  <span className="font-hand text-3xl text-burgundy/80">♡</span>
                  <p className="font-hand text-2xl text-ink">
                    This frame is still on its way
                  </p>
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={photos[index!].src}
                  src={photos[index!].src}
                  alt={photos[index!].alt}
                  className="mx-auto max-h-[74svh] w-auto max-w-full rounded-md object-contain"
                  onError={() => setFailed(true)}
                  decoding="async"
                />
              )}
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 border-t border-rose/30 pt-3">
              <button
                type="button"
                onClick={() => onNavigate(-1)}
                aria-label="Previous photo"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rose/45 text-burgundy transition-colors hover:border-burgundy hover:bg-blush/50"
              >
                <ChevronLeft size={18} strokeWidth={2} />
              </button>

              <div className="min-w-0 flex-1 text-center">
                <p className="font-hand truncate text-xl leading-snug text-ink sm:text-2xl">
                  {photos[index!].caption}
                </p>
                <p className="mt-0.5 text-[11px] tracking-widest text-ink/50">
                  {index! + 1} of {photos.length}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(1)}
                aria-label="Next photo"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rose/45 text-burgundy transition-colors hover:border-burgundy hover:bg-blush/50"
              >
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            </div>

            <button
              type="button"
              data-autofocus
              onClick={onClose}
              aria-label="Close photo"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#241017]/45 text-warm-white backdrop-blur transition-colors hover:bg-[#241017]/70"
            >
              <X size={18} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
