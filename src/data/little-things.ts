/**
 * ============================================================
 *  LITTLE THINGS
 * ============================================================
 * Friendly mini-appreciations shown in section 7.
 * Keep these sincere and general until you know things that
 * are true for Shwetaaa specifically — then make them hers.
 */

export type LittleThing = {
  id: string;
  /** Main line of the card. */
  text: string;
  /** Tiny handwritten footnote. */
  note: string;
  /** Which lucide icon decorates the card. */
  icon: "sparkles" | "flower" | "star" | "heart" | "music";
  /** Subtle rotation in degrees. */
  tilt: number;
};

export const littleThings: LittleThing[] = [
  {
    id: "thing-01",
    text: "The little things that make you, you.",
    note: "unmistakably genuine",
    icon: "sparkles",
    tilt: -1.5,
  },
  {
    id: "thing-02",
    text: "The way one smile can brighten a moment.",
    note: "roll film on that scene",
    icon: "flower",
    tilt: 1,
  },
  {
    id: "thing-03",
    text: "The energy you bring without even trying.",
    note: "natural spotlight",
    icon: "star",
    tilt: -1,
  },
  {
    id: "thing-04",
    text: "The tiny details people might overlook.",
    note: "noticed, always",
    icon: "heart",
    tilt: 1.5,
  },
  {
    id: "thing-05",
    text: "Simply being yourself.",
    note: "the whole point of this list",
    icon: "music",
    tilt: -1,
  },
];
