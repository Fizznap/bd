/**
 * A small typed wrapper around Spotify's official Embed iFrame API.
 *
 * The API boots a script from `open.spotify.com/embed/iframe-api/v1`,
 * then hands the page a controller factory via `onSpotifyIframeApiReady`.
 * `createController(element, options, callback)` swaps the element for the
 * embed iframe and returns a controller that can start/pause playback via
 * postMessage. This never touches private Spotify endpoints or audio
 * data; it only drives the official embed.
 */

export type SpotifyPlaybackUpdate = {
  position?: number;
  duration?: number;
  isPaused?: boolean;
  isBuffering?: boolean;
  /** The URI currently loaded; blank on the embed's initial boot state. */
  playingURI?: string;
};

export type SpotifyEmbedEvent = { data: SpotifyPlaybackUpdate | Record<string, unknown> };

export type SpotifyController = {
  play(): void;
  pause(): void;
  resume(): void;
  togglePlay(): void;
  playFromStart(): void;
  loadUri(uri: string): void;
  addListener(event: string, handler: (e: SpotifyEmbedEvent) => void): () => void;
  removeListener(event: string, handler: (e: SpotifyEmbedEvent) => void): void;
  destroy(): void;
  currentUri: string;
};

export type SpotifyIframeApi = {
  createController(
    element: HTMLElement,
    options: { uri?: string; width?: string; height?: string; startAt?: string },
    callback: (controller: SpotifyController) => void,
  ): void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
    SpotifyIframeConfig?: { loading?: number };
  }
}

/**
 * Fired (synchronously, inside the opening click) by the intro screen so
 * the soundtrack can start with the visitor's very first interaction.
 */
export const MUSIC_OPEN_EVENT = "shwetaaa-open";

const API_SRC = "https://open.spotify.com/embed/iframe-api/v1";
let pendingApi: Promise<SpotifyIframeApi> | null = null;

/**
 * Boots Spotify's iframe API once for the whole page and resolves with
 * the controller factory. Rejects after 10s (or a load error) so callers
 * can fall back to a plain static embed.
 */
export function loadSpotifyIframeApi(): Promise<SpotifyIframeApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Spotify iframe API unavailable during SSR"));
  }
  if (pendingApi) return pendingApi;

  pendingApi = new Promise<SpotifyIframeApi>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error("Spotify iframe API did not load in time"));
    }, 10000);

    // The bootstrap script calls this global the moment it finishes.
    window.onSpotifyIframeApiReady = (api) => {
      window.clearTimeout(timer);
      resolve(api);
    };

    const script = document.createElement("script");
    script.id = "spotify-iframeapi-script";
    script.type = "text/javascript";
    script.src = API_SRC;
    script.async = true;
    script.onerror = () => {
      window.clearTimeout(timer);
      pendingApi = null;
      reject(new Error("Spotify iframe API script failed to load"));
    };
    document.head.appendChild(script);
  });

  // Let a later caller retry instead of waiting on a settled rejection.
  pendingApi.catch(() => {
    pendingApi = null;
  });

  return pendingApi;
}
