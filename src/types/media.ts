/** Shared media types for the birthday experience. */

export type MemoryCategory = "favorites" | "little-things";

export type VideoVariant = "polaroid" | "film" | "cinematic";

export type VideoMemory = {
  /** Stable id used for keys and navigation. */
  id: string;
  /** Short title shown beside the video number. */
  title: string;
  /** Editable handwritten caption. */
  caption: string;
  /** Path to the mp4 file. */
  src: string;
  /** Optional poster / first-frame image. */
  poster?: string;
  /** Optional filter category ("favorites" | "little-things"). */
  category?: MemoryCategory;
  /** Scrapbook card style. */
  variant?: VideoVariant;
  /** Featured cards span two rows in the gallery grid. */
  featured?: boolean;
  /** Slight scrapbook rotation in degrees. */
  tilt?: number;
  /** Intrinsic dimensions used to size thumbnails without reflow. */
  width?: number;
  height?: number;
  /** Friendly duration label such as "0:09". */
  duration?: string;
};

export type PhotoMemory = {
  id: string;
  title: string;
  caption: string;
  src: string;
  /** Descriptive alt text for screen readers. */
  alt: string;
  width: number;
  height: number;
  /** Slight scrapbook rotation in degrees. */
  tilt?: number;
};
