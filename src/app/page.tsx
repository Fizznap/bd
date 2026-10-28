"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import BirthdayReveal from "@/components/BirthdayReveal";
import FinalLetter from "@/components/FinalLetter";
import FloatingDecorations from "@/components/FloatingDecorations";
import Footer from "@/components/Footer";
import IntroNote from "@/components/IntroNote";
import IntroScreen from "@/components/IntroScreen";
import LittleThings from "@/components/LittleThings";
import MusicShortcut from "@/components/MusicShortcut";
import PhotoGallery from "@/components/PhotoGallery";
import SpotifySection from "@/components/SpotifySection";
import VideoGallery from "@/components/VideoGallery";
import { useScrollLock } from "@/lib/lightbox-utils";
import { MUSIC_OPEN_EVENT } from "@/lib/spotify-iframe-api";
import { birthdayConfig } from "@/data/birthday-config";

/**
 * The single-page storytelling experience:
 * opening screen → birthday reveal → note → videos → photos →
 * music → little things → final letter → footer.
 */
export default function Home() {
  const [opened, setOpened] = useState(false);

  // While the opening letter is up, the page itself stays still.
  useScrollLock(!opened);

  useEffect(() => {
    document.title = opened
      ? `Happy Birthday, ${birthdayConfig.recipientName} ♡`
      : `For ${birthdayConfig.recipientName} ♡`;
  }, [opened]);

  const open = useCallback(() => {
    // Dispatched synchronously so the soundtrack's start attempt stays
    // inside the visitor's click gesture (browser autoplay rules allow
    // exactly this kind of permitted start).
    window.dispatchEvent(new Event(MUSIC_OPEN_EVENT));
    setOpened(true);
    window.scrollTo({ top: 0 });
  }, []);

  const replay = useCallback(() => {
    setOpened(false);
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <main className="relative">
      {birthdayConfig.animations.filmGrain ? (
        <div aria-hidden="true" className="film-grain" />
      ) : null}

      <AnimatePresence>
        {!opened ? <IntroScreen key="opening-letter" onOpen={open} /> : null}
      </AnimatePresence>

      {/* The experience itself; inert until the letter is opened. */}
      <div inert={!opened} aria-hidden={!opened}>
        <BirthdayReveal active={opened} />
        <IntroNote />
        <VideoGallery />
        <PhotoGallery />
        <SpotifySection />
        <LittleThings />
        <FinalLetter onReplay={replay} />
        <Footer />
      </div>

      <MusicShortcut visible={opened} />
    </main>
  );
}
