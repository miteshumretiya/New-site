"use client";

/* GSAP + plugins. Only ever imported dynamically through loadGsap() in
   lib/motion.ts, so it stays out of the critical-path bundle. */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ ease: "expo.out", duration: 0.8 });
ScrollTrigger.config({ ignoreMobileResize: true });

/** GSAP-side names for the shared easing family (see lib/motion.ts). */
export const EASE = { out: "expo.out", inOut: "power4.inOut" } as const;
export const DUR = { xs: 0.2, sm: 0.4, md: 0.8, lg: 1.2 } as const;

export { gsap, ScrollTrigger, SplitText };
