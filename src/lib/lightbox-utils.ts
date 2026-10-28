"use client";

import { useEffect, type RefObject } from "react";

/**
 * Locks page scrolling while a dialog (intro screen or lightbox)
 * is open, preserving the previous overflow value on cleanup.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [locked]);
}

type KeyOptions = {
  /** Optional handler for Left/Right arrow navigation. */
  onArrow?: (direction: -1 | 1) => void;
};

/**
 * Keyboard behaviour shared by the lightboxes:
 * Escape closes, arrows navigate, focus moves to the dialog,
 * and focus lives inside the dialog while it is open.
 */
export function useLightboxKeys(
  open: boolean,
  onClose: () => void,
  dialogRef?: RefObject<HTMLElement | null>,
  options?: KeyOptions,
) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (options?.onArrow) {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          options.onArrow(1);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          options.onArrow(-1);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);

    // Move focus into the dialog shortly after opening.
    const focusTimer = setTimeout(() => {
      const modal = dialogRef?.current;
      if (modal) {
        const target = modal.querySelector<HTMLElement>("[data-autofocus]") ?? modal;
        target.focus({ preventScroll: true });
      }
    }, 40);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(focusTimer);
    };
  }, [open, onClose, dialogRef, options]);
}

/** Restores focus to the element that opened a dialog. */
export function returnFocusTo(opener: HTMLElement | null) {
  opener?.focus({ preventScroll: true });
}
