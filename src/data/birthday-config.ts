/**
 * ============================================================
 *  BIRTHDAY CONFIG  —  the one file to personalise.
 * ============================================================
 * Change the texts, dates and options here; media lives in
 * src/data/videos.ts, src/data/photos.ts and src/data/little-things.ts.
 */

export const birthdayConfig = {
  /** Recipient's name (used across the whole experience). */
  recipientName: "Shwetaaa",

  /**
   * Real birthday date, e.g. "2026-11-14" (year-month-day).
   * Leave EMPTY while you do not have a real date — no countdown
   * or date-related copy is rendered until this is configured.
   */
  birthdayDate: "",

  /* ---------------------------------------------------------------- */
  /*  SECTION 1 — Opening screen                                       */
  /* ---------------------------------------------------------------- */
  introPreTitle: "a tiny corner of the internet, wrapped like a letter",
  introTitle: "A little something for you...",
  introSubtitle: "I made a little corner of the internet just for you.",
  openButtonText: "Open your surprise ✨",
  introNote: "made with a little extra love",

  /* ---------------------------------------------------------------- */
  /*  SECTION 2 — Birthday reveal                                      */
  /* ---------------------------------------------------------------- */
  birthdayTitle: "Happy Birthday,",
  birthdayName: "Shwetaaa! ♡",
  birthdaySubtitle:
    "A little collection of moments, smiles, and things I wanted to share with you.",
  birthdayTagline: "Today deserves a little extra magic.",

  /* ---------------------------------------------------------------- */
  /*  SECTION 3 — Introduction note                                    */
  /* ---------------------------------------------------------------- */
  noteHeading: "A little note for you...",
  noteText:
    "Some people have a way of making ordinary moments feel a little more special. This little website is just a small way of sharing a smile with you.",
  noteSignature: "— made just for you ♡",

  /* ---------------------------------------------------------------- */
  /*  SECTION 4 — Video gallery (headings)                             */
  /* ---------------------------------------------------------------- */
  videoHeading: "Little Moments, Big Smiles",
  videoSubtitle: "15+ little pieces of happiness, collected in one place ♡",

  /* ---------------------------------------------------------------- */
  /*  SECTION 5 — Photo gallery (headings)                             */
  /* ---------------------------------------------------------------- */
  photoHeading: "Pretty Little Memories ♡",
  photoSubtitle: "A few frames worth keeping.",

  /* ---------------------------------------------------------------- */
  /*  SECTION 6 — Music                                                */
  /* ---------------------------------------------------------------- */
  spotifyTrackId: "7DfFc7a6Rwfi3YQMRbDMau",
  spotifyTrackTitle: "Thinkin Bout You",
  musicHeading: "A little soundtrack for this moment ♫",
  musicSubtext: "The soundtrack starts playing as you arrive. If your browser needs it, just tap play in the player.",

  /* ---------------------------------------------------------------- */
  /*  SECTION 8 — Final letter                                         */
  /* ---------------------------------------------------------------- */
  finalLetterHeading: "Before You Go... ♡",
  /** Each string is one paragraph of the letter. */
  finalLetterParagraphs: [
    "Hey Shwetaaa,",
    "I wanted to make something a little different for you, so here's this tiny corner of the internet filled with videos, photos, and a few little things to make you smile.",
    "I hope this brings a little happiness to your day and gives you a reason to smile.",
    "You deserve good things, lovely memories, and lots of reasons to be happy.",
    "Keep smiling and keep being you.",
    "Happy Birthday, Shwetaaa! ♡",
  ],
  /** Closing signature line of the letter (editable). */
  finalLetterSignature: "Someone who wanted to make your day a little more special.",
  replayButtonText: "Replay the surprise ↻",

  /* ---------------------------------------------------------------- */
  /*  SECTION 9 — Footer                                               */
  /* ---------------------------------------------------------------- */
  footerText: "Made with ♡, just for Shwetaaa.",

  /* ---------------------------------------------------------------- */
  /*  Sender identity — only shown when showSenderName is true.        */
  /* ---------------------------------------------------------------- */
  showSenderName: false,
  senderName: "",

  /* ---------------------------------------------------------------- */
  /*  Animation preferences                                            */
  /* ---------------------------------------------------------------- */
  animations: {
    /** Short confetti burst when the birthday reveal scrolls into view. */
    confetti: true,
    /** Gentle floating hearts in the opening + reveal sections. */
    floatingHearts: true,
    /** Very light film-grain overlay. */
    filmGrain: true,
  },
} as const;

export type BirthdayConfig = typeof birthdayConfig;
