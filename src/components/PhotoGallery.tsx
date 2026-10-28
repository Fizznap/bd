"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import PhotoLightbox from "@/components/PhotoLightbox";
import { returnFocusTo } from "@/lib/lightbox-utils";
import { birthdayConfig as config } from "@/data/birthday-config";
import { photos } from "@/data/photos";

/**
 * SECTION 5 — the photo album: three large polaroid frames with
 * washi tape, gentle tilts and a lightbox for close-ups.
 */
export default function PhotoGallery() {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const openIndex = useMemo(() => {
    if (!openId) return null;
    const i = photos.findIndex((photo) => photo.id === openId);
    return i === -1 ? null : i;
  }, [openId]);

  const navigate = useCallback((direction: -1 | 1) => {
    setOpenId((currentId) => {
      if (!currentId) return currentId;
      const i = photos.findIndex((photo) => photo.id === currentId);
      if (i === -1) return currentId;
      const next = (i + direction + photos.length) % photos.length;
      return photos[next].id;
    });
  }, []);

  const close = useCallback(() => {
    setOpenId(null);
    returnFocusTo(openerRef.current);
  }, []);

  return (
    <section
      id="frames"
      aria-labelledby="frames-heading"
      className="relative overflow-hidden px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h2
            id="frames-heading"
            className="font-display text-3xl font-semibold leading-[1.15] text-ink sm:text-4xl md:text-5xl"
          >
            {config.photoHeading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink/75 sm:text-lg">
            {config.photoSubtitle}
          </p>
        </motion.div>

        <div className="mt-14 flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-center sm:gap-7 md:gap-9">
          {photos.map((photo, i) => (
            <motion.figure
              key={photo.id}
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={reduce ? undefined : { y: -6, scale: 1.02 }}
              className={`group relative m-0 ${i === 1 ? "sm:mt-10" : ""}`}
              style={{ rotate: `${photo.tilt ?? 0}deg` }}
            >
              <button
                type="button"
                onClick={(event) => {
                  openerRef.current = event.currentTarget;
                  setOpenId(photo.id);
                }}
                aria-label={`Enlarge photo ${i + 1}: ${photo.caption}`}
                className="polaroid block w-full max-w-[240px] outline-offset-4 md:max-w-[272px]"
              >
                <span
                  aria-hidden="true"
                  className="washi washi-rose -top-3 left-1/2 z-10 block h-6 w-14 -translate-x-1/2 -rotate-3"
                />
                <span
                  className="relative block overflow-hidden rounded-[3px] bg-blush/50"
                  style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    width={photo.width}
                    height={photo.height}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 md:group-hover:scale-[1.04]"
                  />
                </span>
                <span className="font-hand mt-2 block px-1 pb-1 text-center text-xl leading-tight text-ink">
                  {photo.caption}
                </span>
              </button>
            </motion.figure>
          ))}
        </div>
      </div>

      <PhotoLightbox
        photos={photos}
        index={openIndex}
        onClose={close}
        onNavigate={navigate}
      />
    </section>
  );
}
