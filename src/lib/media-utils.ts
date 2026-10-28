/** Small helpers shared by the media components. */

/** Formats a 1-based index as a zero-padded video number, e.g. 4 -> "04". */
export function videoNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

/** Formats a duration given in seconds to a compact label like "0:09". */
export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  return `0:${String(s).padStart(2, "0")}`;
}

/** Builds the official Spotify embed iframe source for a track. */
export function getSpotifyEmbedUrl(trackId: string): string {
  return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
}

/** Builds the open-in-Spotify link for a track. */
export function getSpotifyTrackUrl(trackId: string): string {
  return `https://open.spotify.com/track/${trackId}`;
}

/** Deterministic pseudo-random generator (same output on server and client). */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
