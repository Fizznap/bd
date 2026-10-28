"use client";

import { Heart } from "lucide-react";
import { birthdayConfig as config } from "@/data/birthday-config";

/**
 * SECTION 9 — a quiet, minimal footer.
 */
export default function Footer() {
  return (
    <footer className="relative px-6 pb-12 pt-2 text-center">
      <div aria-hidden="true" className="mb-5 flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-rose/50 sm:w-16" />
        <Heart size={14} color="#7B354D" fill="#EFA8BC" strokeWidth={1} />
        <span className="h-px w-10 bg-rose/50 sm:w-16" />
      </div>
      <p className="text-sm leading-relaxed text-ink/75">{config.footerText}</p>
      <p className="font-hand mt-2 text-lg text-rose">with a little extra love</p>
    </footer>
  );
}
