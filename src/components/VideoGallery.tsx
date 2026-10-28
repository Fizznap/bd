"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import VideoCard from "@/components/VideoCard";
import VideoLightbox from "@/components/VideoLightbox";
import { returnFocusTo } from "@/lib/lightbox-utils";
import { videoNumber } from "@/lib/media-utils";
import { birthdayConfig as config } from "@/data/birthday-config";
import { videos, videoCategories } from "@/data/videos";
import type { MemoryCategory } from "@/types/media";

type Filter = "all" | MemoryCategory;

/**
 * SECTION 4 — the video memory gallery: a responsive scrapbook
 * grid of 15+ clips with filter chips and a polished lightbox.
 */
export default function VideoGallery() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  /** Only render chips for categories that actually have videos. */
  const chips = useMemo(
    () =>
      videoCategories.filter(
        (chip) =>
          chip.id === "all" ||
          videos.some((video) => video.category === (chip.id as MemoryCategory)),
      ),
    [],
  );

  const displayed = useMemo(
    () => videos.filter((video) => filter === "all" || video.category === filter),
    [filter],
  );

  const numbers = useMemo(
    () =>
      displayed.map((video) => {
        const dataIndex = videos.findIndex((v) => v.id === video.id);
        return videoNumber(dataIndex < 0 ? 0 : dataIndex);
      }),
    [displayed],
  );

  const openIndex = useMemo(() => {
    if (!openId) return null;
    const i = displayed.findIndex((video) => video.id === openId);
    return i === -1 ? null : i;
  }, [openId, displayed]);

  const navigate = useCallback(
    (direction: -1 | 1) => {
      setOpenId((currentId) => {
        if (!currentId) return currentId;
        const i = displayed.findIndex((video) => video.id === currentId);
        if (i === -1) return currentId;
        const next = (i + direction + displayed.length) % displayed.length;
        return displayed[next].id;
      });
    },
    [displayed],
  );

  const close = useCallback(() => {
    setOpenId(null);
    if (typeof window !== "undefined") {
      returnFocusTo(openerRef.current);
    }
  }, []);

  return (
    <section
      id="moments"
      aria-labelledby="moments-heading"
      className="relative px-5 py-20 sm:px-8 sm:py-24"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(248,221,229,0) 0%, rgba(248,221,229,0.55) 10%, rgba(248,221,229,0.55) 90%, rgba(248,221,229,0) 100%)",
      }}
    >
      <div className="mx-auto max-w-md md:max-w-3xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h2
            id="moments-heading"
            className="font-display text-3xl font-semibold leading-[1.15] text-ink sm:text-4xl md:text-5xl"
          >
            {config.videoHeading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink/75 sm:text-lg">
            {config.videoSubtitle}
          </p>
        </motion.div>

        {/* filter chips */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-wrap justify-center gap-2.5"
          role="group"
          aria-label="Filter the moments"
        >
          {chips.map((chip) => {
            const active = filter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(chip.id as Filter)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 active:scale-[0.97] ${
                  active
                    ? "border-burgundy bg-burgundy text-warm-white shadow-paper"
                    : "border-rose/45 bg-warm-white/70 text-ink/80 hover:border-burgundy/50 hover:text-burgundy"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </motion.div>

        {/* scrapbook grid */}
        <div className="mt-10 grid grid-flow-dense grid-cols-2 auto-rows-[122px] gap-3.5 sm:auto-rows-[138px] md:grid-cols-3 md:gap-5 md:auto-rows-[150px] lg:auto-rows-[158px]">
          <AnimatePresence mode="popLayout" initial={false}>
            {displayed.map((video, i) => (
              <VideoCard
                key={video.id}
                video={video}
                number={numbers[i]}
                featured={video.featured}
                onOpen={(trigger) => {
                  openerRef.current = trigger;
                  setOpenId(video.id);
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <VideoLightbox
        videos={displayed}
        index={openIndex}
        numbers={numbers}
        onClose={close}
        onNavigate={navigate}
      />
    </section>
  );
}
