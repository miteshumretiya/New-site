"use client";

import { useEffect } from "react";
import { MOTION_OK } from "@/lib/motion";
import { scheduleFx } from "@/lib/fx-queue";

/** The giant wordmark rises letter by letter as the footer scrolls in. */
export function FooterFx() {
  useEffect(() => {
    const word = document.querySelector<HTMLElement>("[data-footer-word]");
    if (!word) return;
    let revert = () => {};
    const cancel = scheduleFx(({ gsap }) => {
      const mm = gsap.matchMedia();
      revert = () => mm.revert();
      mm.add(MOTION_OK, () => {
        gsap.from(word.children, {
          yPercent: 100,
          ease: "none",
          stagger: 0.06,
          scrollTrigger: { trigger: word, start: "top bottom", end: "bottom bottom-=10%", scrub: 0.6 },
        });
      });
    });
    return () => {
      cancel();
      revert();
    };
  }, []);
  return null;
}
