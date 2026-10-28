"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Music } from "lucide-react";
import { getSpotifyEmbedUrl, getSpotifyTrackUrl } from "@/lib/media-utils";
import { birthdayConfig as config } from "@/data/birthday-config";
import {
  MUSIC_OPEN_EVENT,
  loadSpotifyIframeApi,
  type SpotifyController,
  type SpotifyEmbedEvent,
  type SpotifyPlaybackUpdate,
} from "@/lib/spotify-iframe-api";

/** Small machine for the status line under the player. */
type PlaybackStatus = "idle" | "playing" | "paused";

/**
 * SECTION 6 — the official Spotify player for the chosen song.
 *
 * Playback runs inside Spotify's official embed (nothing is downloaded
 * or re-hosted), and Spotify's Embed iFrame API lets the song start on
 * the visitor's very first interaction, ideally the "open your surprise"
 * click. Browsers that refuse cross-origin starts (most notably iOS
 * Safari) get a gentle hint to tap play in the player instead.
 */
export default function SpotifySection() {
  const reduce = useReducedMotion();
  const embedUrl = getSpotifyEmbedUrl(config.spotifyTrackId);
  const trackUrl = getSpotifyTrackUrl(config.spotifyTrackId);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<SpotifyController | null>(null);
  const startedRef = useRef(false);
  const pausedRef = useRef(true);
  const attemptsRef = useRef(0);
  const lastAttemptRef = useRef(0);
  const hintTimerRef = useRef<number | null>(null);

  const [playerReady, setPlayerReady] = useState(false);
  const [embedFailed, setEmbedFailed] = useState(false);
  const [playback, setPlayback] = useState<PlaybackStatus>("idle");
  const [hintVisible, setHintVisible] = useState(false);

  /* Mark playback as live and stand down every auto-start helper. */
  const markPlaying = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setPlayback("playing");
    setHintVisible(false);
    if (hintTimerRef.current !== null) {
      window.clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }
  }, []);

  /* One gentle attempt to start the song; a no-op once it is audibly playing. */
  const tryStartPlayback = useCallback((force = false) => {
    const controller = controllerRef.current;
    if (!controller || startedRef.current || pausedRef.current === false) return;

    const now = Date.now();
    if (!force) {
      // Passive triggers (first pointerdown/keydown) stay throttled so a
      // shy browser is never hammered with restart loops.
      if (now - lastAttemptRef.current < 1200) return;
      if (attemptsRef.current >= 30) return;
      attemptsRef.current += 1;
    }
    lastAttemptRef.current = now;

    try {
      // Commands sent while the embed is still loading get queued by the
      // API itself and flushed once the player is ready.
      controller.play();
    } catch {
      // The embed quietly ignores commands it cannot honour.
    }
  }, []);

  /* Give the API-owned iframe the same rounded look the embed had before. */
  const tuckInEmbedFrame = useCallback(() => {
    const iframe = wrapperRef.current?.querySelector("iframe");
    if (!iframe) return;
    iframe.title = `Spotify player: ${config.spotifyTrackTitle}`;
    iframe.setAttribute(
      "allow",
      "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
    );
    iframe.style.display = "block";
    iframe.style.border = "0";
    iframe.style.width = "100%";
    iframe.style.height = "152px";
  }, []);

  useEffect(() => {
    let alive = true;

    loadSpotifyIframeApi()
      .then((api) => {
        if (!alive || !mountRef.current) return;
        // No uri option here: the controller creates its iframe first,
        // then we upgrade it from the API's default `loading="lazy"` to
        // eager so the song preloads while the visitor reads the intro,
        // and only afterwards hand it the track to load.
        api.createController(
          mountRef.current,
          { width: "100%", height: "152" },
          (controller) => {
            if (!alive) {
              controller.destroy();
              return;
            }
            controllerRef.current = controller;

            const iframe = wrapperRef.current?.querySelector("iframe");
            iframe?.setAttribute("loading", "eager");
            iframe?.setAttribute(
              "allow",
              "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
            );
            iframe?.setAttribute("title", `Spotify player: ${config.spotifyTrackTitle}`);

            controller.loadUri(`spotify:track:${config.spotifyTrackId}`);

            const onReady = () => {
              if (!alive) return;
              setPlayerReady(true);
              tuckInEmbedFrame();
              // A soft attempt even before any gesture: starts instantly
              // where browser policy allows, fails silently elsewhere. The
              // ready event fires once, so this bypasses the gesture cap.
              tryStartPlayback(true);
            };

            const onPlaybackUpdate = (event: SpotifyEmbedEvent) => {
              if (!alive) return;
              const update = event?.data as SpotifyPlaybackUpdate | undefined;
              // Only updates that name a loaded track count: the embed's
              // very first update reports isPaused=false with a blank
              // playingURI while nothing has loaded yet (a boot-state trap).
              const audiblyPlaying =
                update?.isPaused === false && typeof update?.playingURI === "string" && update.playingURI !== "";
              pausedRef.current = !audiblyPlaying;
              if (audiblyPlaying) {
                markPlaying();
              } else if (startedRef.current) {
                setPlayback("paused");
              }
            };

            const onError = (event: SpotifyEmbedEvent) => {
              if (!alive) return;
              const detail = event?.data as { recoverable?: boolean } | undefined;
              if (detail?.recoverable === false) {
                controllerRef.current?.destroy();
                controllerRef.current = null;
                setPlayerReady(false);
                setEmbedFailed(true);
              }
            };

            controller.addListener("ready", onReady);
            controller.addListener("playback_update", onPlaybackUpdate);
            // Note: `playback_started` only fires when loadUri completes, not
            // when audio is audible, so it must never flip the UI state.
            controller.addListener("error", onError);
          },
        );
      })
      .catch(() => {
        if (alive) {
          setEmbedFailed(true);
        }
      });

    return () => {
      alive = false;
      controllerRef.current?.destroy();
      controllerRef.current = null;
      if (hintTimerRef.current !== null) {
        window.clearTimeout(hintTimerRef.current);
        hintTimerRef.current = null;
      }
    };
  }, [markPlaying, tuckInEmbedFrame, tryStartPlayback]);

  /* Auto-start triggers: the intro's opening click plus (until the song
     is alive) the visitor's very first presses anywhere on the page. */
  useEffect(() => {
    const onGesture = () => tryStartPlayback(false);
    const onOpen = () => {
      tryStartPlayback(true);
      if (hintTimerRef.current === null) {
        hintTimerRef.current = window.setTimeout(() => {
          if (!startedRef.current) setHintVisible(true);
        }, 6000);
      }
    };

    window.addEventListener("pointerdown", onGesture, { capture: true, passive: true });
    window.addEventListener("keydown", onGesture, { capture: true });
    window.addEventListener(MUSIC_OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("pointerdown", onGesture, { capture: true });
      window.removeEventListener("keydown", onGesture, { capture: true });
      window.removeEventListener(MUSIC_OPEN_EVENT, onOpen);
    };
  }, [tryStartPlayback]);

  const statusLine = embedFailed
    ? "The official player sat in below because the song host could not be reached."
    : !playerReady
      ? "Warming up the song, one moment..."
      : playback === "playing"
        ? "The song is playing now, just for you."
        : playback === "paused"
          ? "The song is waiting; press play in the player whenever you like."
          : hintVisible
            ? "If music hasn't started, tap the play button in the player above."
            : "The song starts with your first touch of the page.";

  return (
    <section
      id="music"
      aria-labelledby="music-heading"
      className="relative overflow-hidden px-6 py-20 sm:py-24"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(248,221,229,0) 0%, rgba(248,221,229,0.7) 12%, rgba(248,221,229,0.7) 88%, rgba(248,221,229,0) 100%)",
      }}
    >
      {/* drifting decorative notes */}
      <span aria-hidden="true" className="anim-drift absolute left-[12%] top-8 text-2xl text-rose/40" style={{ ["--deco-duration" as string]: "11s", ["--deco-opacity" as string]: 0.5 }}>
        ♪
      </span>
      <span aria-hidden="true" className="anim-drift absolute right-[16%] top-14 text-xl text-burgundy/35" style={{ ["--deco-duration" as string]: "14s", ["--deco-opacity" as string]: 0.5, animationDelay: "-5s" }}>
        ♫
      </span>
      <span aria-hidden="true" className="anim-drift absolute left-[20%] bottom-10 text-lg text-burgundy/30" style={{ ["--deco-duration" as string]: "12s", ["--deco-opacity" as string]: 0.5, animationDelay: "-8s" }}>
        ♩
      </span>

      <div className="mx-auto max-w-lg">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="paper-card paper-texture relative p-8 sm:p-10"
        >
          <div aria-hidden="true" className="washi washi-rose -top-3.5 left-1/2 -translate-x-1/2 -rotate-2" />

          <span
            aria-hidden="true"
            className="absolute -left-4 top-8 flex h-11 w-11 -rotate-6 items-center justify-center rounded-full bg-blush/80 shadow-paper"
          >
            <Music size={18} color="#7B354D" strokeWidth={1.8} />
          </span>
          <span
            aria-hidden="true"
            className="absolute -right-5 bottom-10 flex h-10 w-10 rotate-6 items-center justify-center rounded-full bg-peach/90 shadow-paper"
          >
            <Music size={16} color="#7B354D" strokeWidth={1.8} />
          </span>

          <h2
            id="music-heading"
            className="font-display text-3xl font-semibold leading-[1.15] text-ink sm:text-4xl"
          >
            {config.musicHeading}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink/75">
            {config.musicSubtext}
          </p>

          {/* Official Spotify embed via the iFrame API; the API swaps the
              mount div below for its own player iframe. */}
          <div ref={wrapperRef} className={`relative mt-7 overflow-hidden rounded-xl shadow-paper ${embedFailed ? "hidden" : ""}`}>
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 z-10 grid place-items-center bg-warm-white/70 transition-opacity duration-500 ${playerReady ? "opacity-0" : "opacity-100"}`}
            >
              <span className="font-hand text-lg text-burgundy/70">warming up the song…</span>
            </div>
            <div ref={mountRef} className="h-[152px] w-full" />
          </div>

          {embedFailed ? (
            <div className="mt-7 overflow-hidden rounded-xl shadow-paper">
              <iframe
                title={`Spotify player: ${config.spotifyTrackTitle}`}
                src={embedUrl}
                width="100%"
                height={152}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="block w-full border-0"
              />
            </div>
          ) : null}

          <p aria-live="polite" className="mt-3 min-h-6 text-xs font-medium leading-relaxed text-ink/60">
            {statusLine}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 font-hand text-xl text-burgundy/85">
              {playback === "playing" ? (
                <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
                  <span className={`absolute inline-flex h-full w-full rounded-full bg-burgundy ${reduce ? "opacity-75" : "animate-ping opacity-40"}`} />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-burgundy" />
                </span>
              ) : null}
              <span>
                {playback === "playing" ? "Playing" : "Now playing"}: {config.spotifyTrackTitle}
              </span>
            </div>
            <a
              href={trackUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-burgundy/35 bg-warm-white/80 px-4 py-2 text-sm font-medium text-burgundy transition-all duration-300 hover:-translate-y-0.5 hover:border-burgundy hover:bg-blush/60 active:translate-y-px"
            >
              Open in Spotify
              <ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
