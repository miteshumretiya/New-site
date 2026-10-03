"use client";

/* Motion tokens + helpers that ship with the first paint. GSAP itself is only
   ever loaded lazily (see fx-queue.ts); time-critical motion — the hero intro,
   the menu, list staggers — uses the native Web Animations API instead. */

/** One easing family and one duration scale for the whole site. */
export const EASE = {
  out: "cubic-bezier(0.16, 1, 0.3, 1)", // ≈ expo.out
  inOut: "cubic-bezier(0.76, 0, 0.24, 1)", // ≈ power4.inOut
} as const;

export const DUR = { xs: 200, sm: 400, md: 800, lg: 1200 } as const;

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export type GsapModule = typeof import("./gsap");

let gsapPromise: Promise<GsapModule> | undefined;
/** Lazily load GSAP (+ ScrollTrigger, SplitText) once, off the critical path. */
export function loadGsap() {
  return (gsapPromise ??= import("./gsap"));
}

type Keyframes = Keyframe[];

/** Animate a list of elements with a stagger. `fill: backwards` holds the first
 *  keyframe during each delay, so nothing flashes before its turn. */
export function stagger(
  elements: ArrayLike<Element>,
  keyframes: Keyframes,
  {
    duration = DUR.md,
    delay = 0,
    each = 60,
    easing = EASE.out,
  }: { duration?: number; delay?: number; each?: number; easing?: string } = {},
) {
  return Array.from(elements).map((el, i) =>
    el.animate(keyframes, { duration, delay: delay + i * each, easing, fill: "backwards" }),
  );
}
