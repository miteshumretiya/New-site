"use client";

import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";
import { scheduleFx } from "@/lib/fx-queue";

/** Words brighten one by one as the manifesto scrolls through the viewport. */
export function ManifestoFx() {
  useGSAP(() => {
    const el = document.querySelector<HTMLElement>("[data-manifesto]");
    if (!el) return;
    const mm = gsap.matchMedia();
    const cancel = scheduleFx(() =>
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
      }),
    );
    return () => {
      cancel();
      mm.revert();
    };
  });
  return null;
}
