"use client";

import { useEffect } from "react";
import { MOTION_OK } from "@/lib/motion";
import { scheduleFx } from "@/lib/fx-queue";

/** Words brighten one by one as the manifesto scrolls through the viewport.
 *  Dimmed words stay at 40% so they still pass AA contrast for large text. */
export function ManifestoFx() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>("[data-manifesto]");
    if (!el) return;
    let revert = () => {};
    const cancel = scheduleFx(({ gsap, SplitText }) => {
      const mm = gsap.matchMedia();
      revert = () => mm.revert();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(el, {
          type: "words",
          wordsClass: "mf-word",
          aria: "none",
          autoSplit: true,
          onSplit(self) {
            const chips = el.querySelectorAll("[data-chip]");
            const tl = gsap.timeline({
              scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 42%", scrub: true },
            });
            tl.fromTo(self.words, { opacity: 0.4 }, { opacity: 1, stagger: 0.08, ease: "none" }, 0).fromTo(
              chips,
              { scale: 0.4, opacity: 0 },
              { scale: 1, opacity: 1, stagger: 0.6, ease: "none" },
              0,
            );
            return tl;
          },
        });
        return () => split.revert();
      });
    });
    return () => {
      cancel();
      revert();
    };
  }, []);
  return null;
}
