"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 0.8 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** One easing family and one duration scale for the whole site. */
export const EASE = {
  out: "expo.out",
  inOut: "power4.inOut",
  soft: "power2.out",
} as const;

export const DUR = { xs: 0.2, sm: 0.4, md: 0.8, lg: 1.2 } as const;

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const REDUCED = "(prefers-reduced-motion: reduce)";
export const DESKTOP = "(min-width: 1024px)";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED).matches;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
