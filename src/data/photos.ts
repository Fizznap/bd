import type { PhotoMemory } from "@/types/media";

/**
 * ============================================================
 *  PHOTO MEMORIES
 * ============================================================
 * Each entry maps to one file in `public/media/photos/`.
 * Filenames photo-01.jpg, photo-02.jpg, photo-03.jpg come from
 * the WhatsApp originals; captions are editable placeholders.
 * To swap a photo, replace the file (or rename it and update
 * `src` here) — JPEG, PNG and WebP all work.
 */

export const photos: PhotoMemory[] = [
  {
    id: "frame-01",
    title: "Frame 01",
    caption: "Your smile is a whole vibe ♡",
    src: "/media/photos/photo-01.jpg",
    alt: "A snapshot-worthy moment, waiting to be described.",
    width: 640,
    height: 1138,
    tilt: -2,
  },
  {
    id: "frame-02",
    title: "Frame 02",
    caption: "Some moments deserve their own frame.",
    src: "/media/photos/photo-02.jpg",
    alt: "A kept photograph belonging to someone lovely.",
    width: 720,
    height: 1056,
    tilt: 1.5,
  },
  {
    id: "frame-03",
    title: "Frame 03",
    caption: "Simply a little bit of sunshine.",
    src: "/media/photos/photo-03.jpg",
    alt: "A favourite picture, kept for bright days.",
    width: 1200,
    height: 1600,
    tilt: -1,
  },
];
