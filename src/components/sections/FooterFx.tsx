"use client";

import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { scheduleFx } from "@/lib/fx-queue";

/** The giant wordmark rises letter by letter as the footer scrolls in. */
export function FooterFx() {
  useGSAP(() => {
    const word = document.querySelector<HTMLElement>("[data-footer-word]");
    if (!word) return;
    const mm = gsap.matchMedia();
    const cancel = scheduleFx(() =>
      mm.add(MOTION_OK, () => {
        gsap.from(word.children, {
          yPercent: 100,
          ease: "none",
          stagger: 0.06,
          scrollTrigger: { trigger: word, start: "top bottom", end: "bottom bottom-=10%", scrub: 0.6 },
        });
      }),
    );
    return () => {
      cancel();
      mm.revert();
    };
  });
  return null;
}
